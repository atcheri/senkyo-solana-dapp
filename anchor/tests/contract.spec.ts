import { AnchorProvider, BN, Program, Provider } from "@coral-xyz/anchor";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { BankrunProvider, startAnchor } from "anchor-bankrun";
import { Senkyo } from "anchor/target/types/senkyo";
const IDL = require("../target/idl/senkyo.json");

const votingAddress = new PublicKey(
  "CLDgc2Q7uUP7hqhvxkbCAWrFK88qNNmcXqusQUR3dhVp"
);

describe("senkyo smart contract", () => {
  let context;
  let provider: Provider;
  let program: Program<Senkyo>;

  beforeAll(async () => {
    context = await startAnchor(
      "",
      [{ name: "senkyo", programId: votingAddress }],
      []
    );

    provider = new BankrunProvider(context);
    program = new Program<Senkyo>(IDL, provider);
  });

  it("creates a poll", async () => {
    const puppetKeypair = Keypair.generate();
    await program.methods
      .initialize()
      .accounts({ user: puppetKeypair.publicKey })
      .signers([puppetKeypair])
      .rpc();

    const PID = 1;
    const description = `Test Poll #${PID}`;
    const start = new BN(Date.now() / 1000);
    const end = new BN(Date.now() / 1000 + 86400);
    await program.methods.createPoll(description, start, end).rpc();
  });
});
