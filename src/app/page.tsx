"use client";

import Polls from "@/components/polls";
import React from "react";

const fetchedPolls = [
  {
    publicKey: "DummyPollKey1",
    description: "Favorite Thing about Christmas",
    start: new Date("2024-11-24T01:02:00").getTime(),
    end: new Date("2024-11-28T02:03:00").getTime(),
    candidates: 2,
  },
  {
    publicKey: "DummyPollKey2",
    description: "Best Sport in the World",
    start: new Date("2024-12-01T00:00:00").getTime(),
    end: new Date("2024-12-05T23:59:59").getTime(),
    candidates: 5,
  },
  {
    publicKey: "DummyPollKey3",
    description: "Safest Country in the world",
    start: new Date("2024-12-22T00:00:00").getTime(),
    end: new Date("2024-12-25T23:59:59").getTime(),
    candidates: 3,
  },
];

export default function Page() {
  const isInitialized = true; // Assume the system is initialized
  const publicKey = "DummyPublicKey"; // Placeholder public key

  const polls = fetchedPolls.map((p) => ({
    ...p,
    start: new Date(p.start).toLocaleDateString(),
    end: new Date(p.end).toLocaleDateString(),
  }));

  return (
    <div>
      <h2 className="bg-gray-800 text-white rounded-full px-6 py-2 text-lg font-bold mb-8">
        List of Polls
      </h2>

      {!isInitialized && publicKey && (
        <button
          onClick={() => alert("Dummy Initialize")}
          className="bg-gray-800 text-white rounded-full
          px-6 py-2 text-lg font-bold mb-8"
        >
          Initialize
        </button>
      )}

      {!publicKey && polls.length < 1 && (
        <>
          <h2 className="bg-gray-800 text-white rounded-full px-6 py-2 text-lg font-bold mb-8">
            List of Polls
          </h2>
          <p>We don&apos;t have any polls yet, please connect wallet.</p>
        </>
      )}

      <Polls polls={polls} />
    </div>
  );
}
