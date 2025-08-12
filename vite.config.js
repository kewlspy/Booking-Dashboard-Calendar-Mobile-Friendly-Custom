import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/Booking-Dashboard-Calendar-Mobile-Friendly-Custom/",

  plugins: [react(), tailwindcss()],
});
