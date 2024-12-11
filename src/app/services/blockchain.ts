import { AnchorProvider, BN, Program, Wallet } from "@coral-xyz/anchor";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  TransactionSignature,
} from "@solana/web3.js";
import { Senkyo } from "anchor/target/types/senkyo";

import idl from "../../../anchor/target/idl/senkyo.json";

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "http://127.0.0.1:8899";
const programId = new PublicKey(idl.address);

export const getSolanaProvider = (
  publicKey: PublicKey,
  signTransaction: any,
  sendTransaction: any,
): Program<Senkyo> | null => {
  if (publicKey || !signTransaction) {
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
    [Buffer.from("registration")],
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
