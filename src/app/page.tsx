"use client";

import { BN } from "@coral-xyz/anchor";
import Polls from "@/components/polls";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  getCounter,
  getReadOnlySolanaProvider,
  getSolanaProvider,
  initalizeTransaction,
} from "./services/blockchain";

const fetchedPolls = [
  {
    id: 1,
    publicKey: "DummyPollKey1",
    description: "Favorite Thing about Christmas",
    start: new Date("2024-11-24T01:02:00").getTime(),
    end: new Date("2024-11-28T02:03:00").getTime(),
    candidates: 2,
  },
  {
    id: 2,
    publicKey: "DummyPollKey2",
    description: "Best Sport in the World",
    start: new Date("2024-12-01T00:00:00").getTime(),
    end: new Date("2024-12-05T23:59:59").getTime(),
    candidates: 5,
  },
  {
    id: 3,
    publicKey: "DummyPollKey3",
    description: "Safest Country in the world",
    start: new Date("2024-12-22T00:00:00").getTime(),
    end: new Date("2024-12-25T23:59:59").getTime(),
    candidates: 3,
  },
];

export default function Page() {
  const [isInitialized] = useState(async () => {
    const counter = await getCounter(await getReadOnlySolanaProvider());
    return counter.gte(new BN(0));
  });
  const { publicKey, signTransaction, sendTransaction } = useWallet();

  const polls = fetchedPolls.map((p) => ({
    ...p,
    start: new Date(p.start).toLocaleDateString(),
    end: new Date(p.end).toLocaleDateString(),
  }));

  const program = useMemo(() => {
    if (!publicKey) {
      return null;
    }

    return getSolanaProvider(publicKey, signTransaction, sendTransaction);
  }, [publicKey, signTransaction, sendTransaction]);

  const handleInit = async () => {
    if (!isInitialized && !!publicKey) {
      return;
    }

    await toast.promise(
      new Promise<void>(async (resolve, reject) => {
        if (!program || !publicKey) {
          return;
        }

        try {
          await initalizeTransaction(program, publicKey);
          resolve();
        } catch (error) {
          reject(error);
        }
      }),
      {
        loading: "Approving transaction ...",
        success: "Transaction succesful",
        error: "Transaction failed",
      },
    );
  };

  if (!isInitialized && publicKey) {
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
      <p className="self-center">
        We don&apos;t have any polls yet, please connect wallet.
      </p>
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
