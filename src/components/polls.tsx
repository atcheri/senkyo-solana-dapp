import { atom } from "jotai";
import Link from "next/link";
import { FC } from "react";

type Poll = {
  id: number;
  publicKey: string;
  description: string;
  start: string;
  end: string;
  candidates: number;
};

export const pollAtom = atom<Poll | null>(null);

type PollsProps = {
  polls: Poll[];
};

const Polls: FC<PollsProps> = ({ polls }) => {
  if (!polls.length) {
    return (
      <div>
        <h2 className="mb-8 rounded-full bg-gray-800 px-6 py-2 text-lg font-bold text-white">
          List of Polls
        </h2>
        <p>We don&apos;t have any polls yet, be the first to create one.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 place-items-center gap-6 md:grid-cols-2 lg:grid-cols-3">
      {polls.map((poll) => (
        <div
          key={poll.publicKey}
          className="space-y-4 rounded-xl border border-gray-300 bg-white p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-800">
            {poll.description.length > 20
              ? poll.description.slice(0, 25) + "..."
              : poll.description}
          </h3>
          <div className="text-sm text-gray-600">
            <p>
              <span className="font-semibold">Starts:</span> {poll.start}
            </p>
            <p>
              <span className="font-semibold">Ends:</span> {poll.end}
            </p>
            <p>
              <span className="font-semibold">Candidates:</span>{" "}
              {poll.candidates}
            </p>
          </div>

          <div className="w-full">
            <Link
              href={`/polls/${poll.publicKey}`}
              className="block w-full rounded-lg bg-black px-4 py-2 text-center font-bold text-white transition duration-200 hover:bg-gray-900"
            >
              View Poll
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Polls;
