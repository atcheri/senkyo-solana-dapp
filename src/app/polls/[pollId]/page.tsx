"use client";

import {
  fetchAllCandidates,
  fetchPollDetails,
  getReadOnlySolanaProvider,
  hasUserVoted,
} from "@/app/services/blockchain";
import { useAtom } from "jotai";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { pollAtom } from "./state";
import { candidatesAtom } from "@/components/candidate";
import CandidateList from "./components/candidates-list";
import CandidateDialog from "./components/candidate-dialog";
import { useWallet } from "@solana/wallet-adapter-react";
import { BsCheck2Circle } from "react-icons/bs";

export default function PollDetails() {
  const [hasVoted, setHasVoted] = useState(false);
  const { pollId } = useParams();
  const [poll, setPoll] = useAtom(pollAtom);
  const [candidates, setCandidates] = useAtom(candidatesAtom);
  const { publicKey } = useWallet();

  const program = useMemo(() => getReadOnlySolanaProvider(), []);

  const fetchPageData = async () => {
    return Promise.all([
      fetchPollDetails(program, pollId as string),
      fetchAllCandidates(program, pollId as string),
    ]);
  };

  const updatePageData = async () => {
    const [pollDetails, candidates] = await fetchPageData();
    setPoll(pollDetails);
    setCandidates(candidates);

    const hasVoted = await hasUserVoted(program!, publicKey!, pollDetails.id);
    setHasVoted(hasVoted);
  };

  useEffect(() => {
    if (!program || !pollId) return;

    updatePageData();
  }, [program, pollId]);

  if (!poll) {
    return (
      <div className="flex flex-col items-center py-10">
        <h2 className="text-lg font-semibold text-gray-700">
          Loading poll details...
        </h2>
      </div>
    );
  }

  const active = new Date(poll.start) <= new Date();

  return (
    <>
      <div className="flex flex-col items-center space-y-6 py-10">
        <h2 className="rounded-full bg-gray-800 px-6 py-2 text-lg font-bold text-white">
          Poll Details
        </h2>
        {hasVoted && (
          <>
            <h3 className="text-xl">You have already voted</h3>
            <BsCheck2Circle className="fill-green-600 text-6xl" />
          </>
        )}
        <div className="w-4/5 space-y-4 rounded-xl border border-gray-300 bg-white p-6 text-center shadow-lg md:w-3/5">
          <h3 className="text-xl font-bold text-gray-800">
            {poll.description}
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <span className="font-semibold">Starts:</span>{" "}
              {new Date(poll.start).toLocaleString()}
            </p>
            <p>
              <span className="font-semibold">Ends:</span>{" "}
              {new Date(poll.end).toLocaleString()}
            </p>
            <p>
              <span className="font-semibold">Candidates:</span>{" "}
              {poll.candidates}
            </p>
          </div>
        </div>

        <CandidateDialog
          pollId={poll.id}
          pollAddress={poll.publicKey}
          onSuccess={updatePageData}
        />

        {candidates.length > 0 && (
          <CandidateList
            active={active}
            candidates={candidates}
            pollId={poll.id}
            onVotedCallback={updatePageData}
          />
        )}
      </div>
    </>
  );
}
