import * as web3 from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import type { Crowdfunding } from "../target/types/crowdfunding";

// Configure the client to use the local cluster
anchor.setProvider(anchor.AnchorProvider.env());

const program = anchor.workspace.Crowdfunding as anchor.Program<Crowdfunding>;


async function main() {
  // 1. Validaciones de seguridad del entorno SolPG
  if (!pg.wallet) {
    console.error(
      "❌ Error: Billetera no conectada. Haz clic en 'Not Connected' abajo a la izquierda."
    );
    return;
  }

  if (!program) {
    console.error(
      "❌ Error: program no existe. Necesitas hacer clic en 'Build' (el martillo) para que SolPG detecte tu código."
    );
    return;
  }

  // 2. Extraemos las herramientas de forma segura
  const program = program;
  const wallet = pg.wallet;

  try {
    // 3. Calculamos el PDA (Dirección de la campaña)
    const [campaignPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("CAMPAIGN_DEMO"), wallet.publicKey.toBuffer()],
      program.programId
    );

    console.log("📍 Buscando campaña en el PDA:", campaignPda.toBase58());

    // 4. Obtenemos los datos de la blockchain
    const account = await program.account.campaign.fetch(campaignPda);

    console.log("\n--- 🚀 ESTADO DE LA CAMPAÑA ---");
    console.log("Nombre:     ", account.name);
    console.log("Admin:      ", account.admin.toBase58());
    console.log("Meta:       ", account.target.toNumber() / 1e9, "SOL");
    console.log("Recaudado:  ", account.amountDonated.toNumber() / 1e9, "SOL");
    console.log("-------------------------------\n");
  } catch (err) {
    console.error("\n❌ Error al leer la cuenta en la blockchain:");
    console.log("Motivo más probable: La cuenta PDA aún no ha sido creada.");
    console.log(
      "Solución: Ve a la pestaña 'Test' y ejecuta la prueba que llama a 'createCampaign' primero."
    );
    console.log("Detalle técnico:", err.message);
  }
}

main();
