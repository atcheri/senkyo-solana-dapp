import { Poll } from "@/components/polls";
import { atom } from "jotai";

export const pollAtom = atom<Poll | null>(null);
