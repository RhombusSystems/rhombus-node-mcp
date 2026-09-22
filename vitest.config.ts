import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Run in Node.js — no browser/DOM APIs needed
    environment: "node",

    // Pick up test files under both src/ (unit, colocated) and test/ (integration)
    include: ["src/**/*.test.ts", "test/**/*.test.ts"],

    // Explicitly load .env.test into process.env before any test module is imported.
    // This ensures module-level env reads (e.g. in network.ts) see the correct values.
    setupFiles: ["./test/setup.ts"],
  },
});
