import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Explicitly load .env.test before any test module is imported.
// This ensures process.env is populated before module-level constants
// (e.g. in network.ts) are evaluated.
const result = config({ path: resolve(__dirname, "../.env.test"), override: true });

if (result.error) {
  console.warn("[test/setup] Failed to load .env.test:", result.error.message);
} else {
  const loaded = Object.keys(result.parsed ?? {});
  console.log("[test/setup] Loaded .env.test — variables:", loaded.join(", "));
}
