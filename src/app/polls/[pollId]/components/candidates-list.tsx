import {
  getSolanaProvider,
  hasUserVoted,
  vote,
} from "@/app/services/blockchain";
import { Candidate } from "@/components/candidate";
import { Button } from "@/components/ui/button";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { FC, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { GiSandsOfTime } from "react-icons/gi";

interface CandidateListProps {
  active: boolean;
  candidates: Candidate[];
  pollId: number;
  onVotedCallback: () => Promise<void>;
}

const CandidateList: FC<CandidateListProps> = ({
  active,
  candidates,
  pollId,
  onVotedCallback,
}) => {
  const [voted, setVoted] = useState<boolean>(false);
  const { publicKey, sendTransaction, signTransaction } = useWallet();

  const fetchVotingStatus = async () => {
    const status = await hasUserVoted(program!, publicKey!, pollId);
    setVoted(status);
  };

  const program = useMemo(() => {
    if (!publicKey) {
      return;
    }

    return getSolanaProvider(publicKey, signTransaction, sendTransaction);
  }, [publicKey, signTransaction, sendTransaction]);

  useEffect(() => {
    if (!program || !publicKey) return;

    fetchVotingStatus();
  }, [program, publicKey, candidates]);

  const handleVote = async (candidate: Candidate) => {
    if (voted) return;

    await toast.promise(
      new Promise<void>(async (resolve, reject) => {
        try {
          await vote(program!, publicKey!, candidate.pollId, candidate.cid);
          await fetchVotingStatus();
          await onVotedCallback();
        } catch (error) {
          console.error("Voting failed:", error);
          reject(error);
        }
      }),
      {
        loading: "Approving vote...",
        success: "Vote successful 👌",
        error: "Encountered error 🤯",
      },
    );
  };

  return (
    <div className="w-4/5 space-y-4 rounded-xl border border-gray-300 bg-white p-6 text-center shadow-lg md:w-3/5">
      <div className="space-y-2">
        {!active && (
          <div className="flex flex-col items-center justify-center gap-2">
            <GiSandsOfTime className="text-4xl" />
            <p>The votes will start soon ... </p>
          </div>
        )}
        {candidates.map((candidate) => (
          <div
            key={candidate.publicKey}
            className="flex items-center justify-between border-b border-gray-300 pb-4 last:border-none last:pb-0"
          >
            <span className="font-medium text-gray-800">{candidate.name}</span>
            {active && (
              <span className="flex items-center space-x-2 text-sm text-gray-600">
                <Button
                  onClick={() => handleVote(candidate)}
                  variant="secondary"
                  disabled={voted}
                >
                  {voted ? "Voted" : "Vote"}{" "}
                  <span className="font-semibold">{candidate.votes}</span>
                </Button>
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateList;
