import { spawnSync } from "node:child_process";

const result = spawnSync(
  "npx",
  [
    "prisma",
    "migrate",
    "resolve",
    "--rolled-back",
    "20260717120000_init",
    "--schema",
    "prisma/postgres/schema.prisma",
  ],
  {
    shell: true,
    stdio: "inherit",
  },
);

if (result.status === 0) {
  console.log("Recovered failed Vercel migration 20260717120000_init.");
} else {
  console.log("No failed Vercel migration needed recovery.");
}
