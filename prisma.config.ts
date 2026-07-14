import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "prisma/config";

const rootDir = dirname(fileURLToPath(import.meta.url));

function loadEnvFile(path: string) {
  if (!existsSync(path)) {
    return;
  }

  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);

    if (!match) {
      continue;
    }

    const [, key, rawValue = ""] = match;

    if (key in process.env) {
      continue;
    }

    const value = rawValue
      .trim()
      .replace(/^(['"])(.*)\1$/, "$2")
      .replace(/\\n/g, "\n");

    process.env[key] = value;
  }
}

loadEnvFile(join(rootDir, ".env"));

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "node prisma/seed.mjs",
  },
});
