"use client";

import { NextPage } from "next";
import { useEffect, useMemo, useState } from "react";
import {
  createPoll,
  getCounter,
  getSolanaProvider,
} from "../services/blockchain";
import { BN } from "@coral-xyz/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";

const Page: NextPage = () => {
  const { publicKey, sendTransaction, signTransaction } = useWallet();
  const [nextCount, setNextCount] = useState<BN>(new BN(0));
  const [isInitialized, setIsInitialized] = useState(false);

  const program = useMemo(() => {
    if (!publicKey) {
      return;
    }

    return getSolanaProvider(publicKey, signTransaction, sendTransaction);
  }, [publicKey, signTransaction, sendTransaction]);

  const [formData, setFormData] = useState({
    description: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchCounter = async () => {
      if (!program) {
        return;
      }
      const count = await getCounter(program);
      setNextCount(count.add(new BN(1)));
      setIsInitialized(count.gte(new BN(0)));
    };

    fetchCounter();
  }, [program]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!program || !isInitialized || !publicKey) return;

    const { description, startDate, endDate } = formData;
    const startTimestamp = new Date(startDate).getTime() / 1000;
    const endTimestamp = new Date(endDate).getTime() / 1000;

    await toast.promise(
      new Promise<void>(async (resolve, reject) => {
        try {
          const tx = await createPoll(
            program,
            publicKey,
            nextCount,
            description,
            startTimestamp,
            endTimestamp,
          );

          setFormData({
            description: "",
            startDate: "",
            endDate: "",
          });

          resolve(tx as any);
        } catch (error) {
          reject(error);
        }
      }),
      {
        loading: "Approve transaction...",
        success: "Transaction successful",
        error: "Transaction failed",
      },
    );
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="h-16"></div>
      <div className="flex w-full flex-col items-center justify-center space-y-6">
        <h2 className="rounded-full bg-gray-800 px-6 py-2 text-lg font-bold text-white">
          Create a Poll
        </h2>

        <form
          className="w-4/5 space-y-6 rounded-2xl border border-gray-300 bg-white p-6 shadow-lg md:w-2/5"
          onSubmit={handleSubmit}
        >
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-700"
            >
              Poll Description
            </label>
            <input
              type="text"
              id="description"
              placeholder="Briefly describe the purpose of this poll..."
              required
              className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-semibold text-gray-700"
            >
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              required
              className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
            />
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-semibold text-gray-700"
            >
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              required
              className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
            />
          </div>

          <div className="flex w-full justify-center">
            <button
              type="submit"
              className="w-full rounded-lg bg-black px-6 py-3 font-bold text-white transition duration-200 hover:bg-gray-900"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
