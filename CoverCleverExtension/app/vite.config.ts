import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist", // Output directory
    emptyOutDir: true, // Clear output before building
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, "src/popup/index.html"), // Popup UI
        content: path.resolve(__dirname, "public/content.js"), // Content script
        background: path.resolve(__dirname, "public/background.js"), // Background script
      },
      output: {
        entryFileNames: "[name].js", // Use [name] from input
        format: "esm",
      },
    },
  },
});
