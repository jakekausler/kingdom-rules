import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  clearScreen: false,
  server: {
    port: 9031,
    host: true,
    allowedHosts: ["localhost", "127.0.0.1", "kingmaker.jakekausler.com"],
    watch: {
      ignored: ["./json/map.json"],
    },
  },
});
