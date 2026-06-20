import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Helps Vitest resolve a MUI/react-transition-group dependency in the test environment.
      "react-transition-group/TransitionGroupContext": fileURLToPath(
        new URL(
          "./node_modules/react-transition-group/cjs/TransitionGroupContext.js",
          import.meta.url,
        ),
      ),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.js",
    server: {
      deps: {
        inline: ["@mui/material", "react-transition-group"],
      },
    },
  },
});
