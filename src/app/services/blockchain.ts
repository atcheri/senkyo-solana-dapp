import { AnchorProvider, BN, Program, Wallet } from "@coral-xyz/anchor";
import {
  Connection,
  PublicKey,
  SystemProgram,
  TransactionSignature,
} from "@solana/web3.js";
import { Senkyo } from "anchor/target/types/senkyo";

import idl from "../../../anchor/target/idl/senkyo.json";
import { Poll } from "@/components/polls";
import { Candidate } from "@/components/candidate";

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "http://127.0.0.1:8899";
const programId = new PublicKey(idl.address);

export const getSolanaProvider = (
  publicKey: PublicKey,
  signTransaction: any,
  sendTransaction: any,
): Program<Senkyo> | null => {
  if (!publicKey || !signTransaction) {
    return null;
  }

  const conn = new Connection(RPC_URL, "finalized");
  const wallet = {
    publicKey,
    signTransaction,
    sendTransaction,
  } as unknown as Wallet;
  const provider = new AnchorProvider(conn, wallet, {
    commitment: "processed",
  });

  return new Program<Senkyo>(idl as any, provider);
};

export const getReadOnlySolanaProvider = (): Program<Senkyo> => {
  const connection = new Connection(RPC_URL, "confirmed");

  const wallet = {
    publicKey: PublicKey.default,
    signTransaction: async () => {
      throw new Error("Read-only provider cannot sign transactions.");
    },
    signAllTransactions: async () => {
      throw new Error("Read-only provider cannot sign transactions.");
    },
  };

  const provider = new AnchorProvider(connection, wallet as unknown as Wallet, {
    commitment: "processed",
  });

  return new Program<Senkyo>(idl as any, provider);
};

export const initalizeTransaction = async (
  program: Program<Senkyo>,
  publicKey: PublicKey,
): Promise<TransactionSignature> => {
  const [counterPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("counter")],
    programId,
  );
  const [registrationPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("registrations")],
    programId,
  );

  const tx = await program.methods
    .initialize()
    .accountsPartial({
      user: publicKey,
      counter: counterPda,
      registrations: registrationPda,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  const connection = new Connection(
    program.provider.connection.rpcEndpoint,
    "confirmed",
  );

  const blockhash = await connection.getLatestBlockhash();
  await connection.confirmTransaction({
    signature: tx,
    blockhash: blockhash.blockhash,
    lastValidBlockHeight: blockhash.lastValidBlockHeight,
  });

  return tx;
};

export const getCounter = async (program: Program<Senkyo>): Promise<BN> => {
  try {
    const [counterPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("counter")],
      programId,
    );

    const counter = await program.account.counter.fetch(counterPda);
    if (!counter) {
      return new BN(-1);
    }

    return counter.count;
  } catch (error) {
    console.error("faild to retrieve the counter program", error);
    return new BN(-1);
  }
};

export const createPoll = async (
  program: Program<Senkyo>,
  publicKey: PublicKey,
  nextCount: BN,
  description: string,
  start: number,
  end: number,
): Promise<TransactionSignature> => {
  const [counterPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("counter")],
    programId,
  );
  const [pollPda] = PublicKey.findProgramAddressSync(
    [nextCount.toArrayLike(Buffer, "le", 8)],
    programId,
  );

  const startBN = new BN(start);
  const endBN = new BN(end);

  const tx = await program.methods
    .createPoll(description, startBN, endBN)
    .accountsPartial({
      user: publicKey,
      counter: counterPda,
      poll: pollPda,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  const connection = new Connection(
    program.provider.connection.rpcEndpoint,
    "confirmed",
  );

  const blockhash = await connection.getLatestBlockhash();
  await connection.confirmTransaction({
    signature: tx,
    blockhash: blockhash.blockhash,
    lastValidBlockHeight: blockhash.lastValidBlockHeight,
  });

  return tx;
};

export const fetchPolls = async (program: Program<Senkyo>): Promise<Poll[]> => {
  const polls = await program.account.poll.all();
  return formatPolls(polls);
};

const formatPolls = (polls: any[]): Poll[] =>
  polls.map((p: any) => {
    return {
      ...p.account,
      ...formatPoll({ ...p.account, publicKey: p.publicKey }),
    };
  });

const formatDate = (d: number) => new Date(d).toLocaleDateString();

const formatPoll = (poll: any): Poll => {
  return {
    description: poll.description,
    publicKey: poll.publicKey ? poll.publicKey.toBase58() : "",
    id: poll.id.toNumber(),
    start: formatDate(poll.start.toNumber() * 1000),
    end: formatDate(poll.end.toNumber() * 1000),
    candidates: poll.candidates.toNumber(),
  };
};

export const fetchPollDetails = async (
  program: Program<Senkyo>,
  pollAddress: string,
): Promise<Poll> => {
  const poll = await program.account.poll.fetch(pollAddress);
  const formattedPoll = formatPoll(poll);

  return formattedPoll;
};

export const fetchAllCandidates = async (
  program: Program<Senkyo>,
  pollAddress: string,
): Promise<Candidate[]> => {
  const pollData = await fetchPollDetails(program, pollAddress);
  if (!pollData) return [];

  const PID = new BN(pollData.id);

  const candidateAccounts = await program.account.candidate.all();
  const candidates = candidateAccounts.filter((candidate) => {
    return candidate.account.pollId.eq(PID);
  });

  return candidates.map(formatCandidate);
};

const formatCandidate = (candidate: any): Candidate => {
  return {
    ...candidate,
    publicKey: candidate.publicKey.toBase58(), // Convert to string
    cid: candidate.cid.toNumber(),
    pollId: candidate.pollId.toNumber(),
    votes: candidate.votes.toNumber(),
    name: candidate.name,
  };
};
