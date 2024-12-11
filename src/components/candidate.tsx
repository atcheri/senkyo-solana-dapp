import { atom } from "jotai";

export const candidatesAtom = atom<Candidate[]>([]);

export type Candidate = {
  publicKey: string;
  cid: number;
  pollId: number;
  name: string;
  votes: number;
  hasRegistered: boolean;
};
