import Link from "next/link";
import { FC } from "react";

type PollsProps = {
  polls: {
    publicKey: string;
    description: string;
    start: string;
    end: string;
    candidates: number;
  }[];
};

const Polls: FC<PollsProps> = ({ polls }) => {
  if (!polls.length) {
    return (
      <>
        <h2 className="bg-gray-800 text-white rounded-full px-6 py-2 text-lg font-bold mb-8">
          List of Polls
        </h2>
        <p>We don&apos;t have any polls yet, be the first to create one.</p>
      </>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-4/5">
      {polls.map((poll) => (
        <div
          key={poll.publicKey}
          className="bg-white border border-gray-300 rounded-xl shadow-lg p-6 space-y-4"
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
              className="bg-black text-white font-bold py-2 px-4 rounded-lg
                hover:bg-gray-900 transition duration-200 w-full block text-center"
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
