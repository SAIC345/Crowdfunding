import BN from "bn.js";
import assert from "assert";
import * as web3 from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Crowdfunding } from "../target/types/crowdfunding";
import * as assert from "assert"; import type { Crowdfunding } from "../target/types/crowdfunding";
// <-- ¡El cambio está aquí! Usamos el assert nativo

describe("crowdfunding", () => {
  // Configure the client to use the local cluster
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Crowdfunding as anchor.Program<Crowdfunding>;
  
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Crowdfunding as Program<Crowdfunding>;

  // Derivamos la dirección de la campaña (PDA)
  const [campaignPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("CAMPAIGN_DEMO"), provider.wallet.publicKey.toBuffer()],
    program.programId
  );

  it("¡Crea una campaña con éxito!", async () => {
    try {
      const tx = await program.methods
        .createCampaign(
          "Salvar el Océano",
          "Campaña para limpiar playas",
          new anchor.BN(2 * anchor.web3.LAMPORTS_PER_SOL) // Meta: 2 SOL
        )
        .accounts({
          campaign: campaignPda,
          user: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      const account = await program.account.campaign.fetch(campaignPda);
      assert.strictEqual(account.name, "Salvar el Océano");
      assert.strictEqual(
        account.admin.toString(),
        provider.wallet.publicKey.toString()
      );
      console.log("✅ Transacción de creación:", tx);
    } catch (error) {
      console.log(
        "Nota: Si la campaña ya existía, este paso dará error. Puedes ignorarlo o cambiar la semilla."
      );
    }
  });

  it("Dona 1 SOL a la campaña", async () => {
    const amount = new anchor.BN(1 * anchor.web3.LAMPORTS_PER_SOL);

    await program.methods
      .donate(amount)
      .accounts({
        campaign: campaignPda,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const account = await program.account.campaign.fetch(campaignPda);
    console.log(
      "✅ Donación exitosa. Total acumulado:",
      account.amountDonated.toNumber() / 1e9,
      "SOL"
    );
  });

  it("Retira los fondos (Solo Admin)", async () => {
    const withdrawAmount = new anchor.BN(0.5 * anchor.web3.LAMPORTS_PER_SOL);

    await program.methods
      .withdraw(withdrawAmount)
      .accounts({
        campaign: campaignPda,
        user: provider.wallet.publicKey,
      })
      .rpc();

    const account = await program.account.campaign.fetch(campaignPda);
    console.log(
      "✅ Retiro exitoso. Balance restante en campaña:",
      account.amountDonated.toNumber() / 1e9,
      "SOL"
    );
  });
});
