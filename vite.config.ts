import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// Замените на имя вашего репозитория на GitHub!
const TrainingTimer = "training-timer";

export default defineConfig({
  base: `/${TrainingTimer}/`,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon.svg"],
      manifest: {
        name: "Workout Timer",
        short_name: "Timer",
        description: "Интервальный таймер для тренировок",
        theme_color: "#020617",
        background_color: "#020617",
        display: "standalone",
        orientation: "portrait",
        start_url: `/${TrainingTimer}/`,
        scope: `/${TrainingTimer}/`,
        icons: [
          {
            src: "icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});
