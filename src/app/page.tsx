"use client";

import Polls from "@/components/polls";
import React from "react";

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
  const isInitialized = true; // Assume the system is initialized
  const publicKey = "DummyPublicKey"; // Placeholder public key

  const polls = fetchedPolls.map((p) => ({
    ...p,
    start: new Date(p.start).toLocaleDateString(),
    end: new Date(p.end).toLocaleDateString(),
  }));

  return (
    <>
      <h2 className="mb-8 self-center rounded-full bg-gray-800 px-16 py-4 text-lg font-bold text-white">
        List of Polls
      </h2>

      <Polls polls={polls} />
    </>
  );
}
