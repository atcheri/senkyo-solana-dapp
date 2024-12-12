import { Candidate } from "@/components/candidate";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  candidates: Candidate[];
  pollAddress: string;
  pollId: number;
}

const CandidateList = ({ candidates }: Props) => {
  const [voted, setVoted] = useState<boolean>(false);

  const handleVote = async (candidate: Candidate) => {
    if (voted) return;

    await toast.promise(
      new Promise<void>((resolve, reject) => {
        try {
          console.log(
            `Voting for candidate: ${candidate.name} (ID: ${candidate.cid})`,
          );
          // Simulate voting success
          setTimeout(() => {
            setVoted(true);
            resolve();
          }, 1000);
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
        {candidates.map((candidate) => (
          <div
            key={candidate.publicKey}
            className="flex items-center justify-between border-b border-gray-300 pb-4 last:border-none last:pb-0"
          >
            <span className="font-medium text-gray-800">{candidate.name}</span>
            <span className="flex items-center space-x-2 text-sm text-gray-600">
              <button
                onClick={() => handleVote(candidate)}
                className={`px-2 py-1 bg-${voted ? "red" : "green"}-100 text-${
                  voted ? "red" : "green"
                }-700 ${!voted && "hover:bg-green-200"} rounded`}
                disabled={voted}
              >
                {voted ? "Voted" : "Vote"}{" "}
                <span className="font-semibold">{candidate.votes}</span>
              </button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateList;
