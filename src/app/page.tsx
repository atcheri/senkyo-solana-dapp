"use client";

import { BN } from "@coral-xyz/anchor";
import Polls, { Poll } from "@/components/polls";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  fetchPolls,
  getCounter,
  getReadOnlySolanaProvider,
  getSolanaProvider,
  initalizeTransaction,
} from "./services/blockchain";

export default function Page() {
  const [isInitialized, setIsInitialized] = useState(false);
  const { publicKey, signTransaction, sendTransaction } = useWallet();
  const programReadOnly = useMemo(() => getReadOnlySolanaProvider(), []);
  const [polls, setPolls] = useState<Poll[]>([]);

  const program = useMemo(() => {
    if (!publicKey) {
      return null;
    }

    return getSolanaProvider(publicKey, signTransaction, sendTransaction);
  }, [publicKey, signTransaction, sendTransaction]);

  const fetchData = async () => {
    const count = await getCounter(programReadOnly);
    setIsInitialized(count.gte(new BN(0)));
    if (!program) {
      return;
    }

    fetchPolls(program).then(setPolls);
  };

  useEffect(() => {
    if (!programReadOnly) {
      return;
    }

    fetchData();
  }, [programReadOnly, program]);

  const handleInit = async () => {
    if (isInitialized && !!publicKey) {
      return;
    }

    await toast.promise(
      new Promise<void>(async (resolve, reject) => {
        if (!program || !publicKey) {
          return;
        }

        try {
          await initalizeTransaction(program, publicKey);
          setIsInitialized(true);
          resolve();
        } catch (error) {
          reject(error);
        }
      }),
      {
        loading: "Approving transaction ...",
        success: "Transaction successful",
        error: "Transaction failed",
      },
    );
  };

  if (!isInitialized && !!publicKey) {
    return (
      <button
        onClick={handleInit}
        className="mb-8 self-center rounded-full bg-gray-800 px-6 py-2 text-lg font-bold text-white"
      >
        Initialize
      </button>
    );
  }

  if (!publicKey) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="self-center text-4xl">{":'("}</h1>
        <p className="self-center">
          We don&apos;t have any polls yet, please connect wallet.
        </p>
      </div>
    );
  }

  return (
    <>
      <h2 className="mb-8 self-center rounded-full bg-gray-800 px-16 py-4 text-lg font-bold text-white">
        List of Polls
      </h2>

      <Polls polls={polls} />
    </>
  );
}
