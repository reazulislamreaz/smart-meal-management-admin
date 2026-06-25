import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  preview: {
    host: "206.162.244.11",
    port: 9173,
    strictPort: true,
  },
  // server: {
  //   port: 3000, // Your desired port
  //   strictPort: true, // Prevent Vite from choosing another port if 3000 is busy
  // },
});
