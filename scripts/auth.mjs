import fnbr from "fnbr";
import fs from "node:fs/promises";
import readline from "node:readline/promises";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

async function main() {
  console.log("Abra o link e pegue o authorization code (JSON):");
  console.log("https://www.epicgames.com/id/login?redirectUrl=https%3A%2F%2Fwww.epicgames.com%2Fid%2Fapi%2Fexchange");

  const code = (await rl.question("\nCole o authorizationCode aqui: ")).trim();
  rl.close();

  const client = new fnbr.Client({
    auth: {
      authorizationCode: code,
    },
  });

  await client.login();

  const deviceAuth = await client.auth.createDeviceAuth();
  // { accountId, deviceId, secret }

  await fs.writeFile("deviceAuth.json", JSON.stringify(deviceAuth, null, 2));
  console.log("\n✅ deviceAuth.json criado. NÃO commita isso no git.");
  console.log(deviceAuth);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});