import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

dotenv.config();
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: process.env.VITE_KEY_PATH || "",
      cert: process.env.VITE_CERT_PATH || "",
    },
  },
});
