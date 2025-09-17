import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: "node", // or "jsdom" if you test React components
    include: ["src/**/*.test.ts"], // adjust if your tests are in a different folder
  },
});
