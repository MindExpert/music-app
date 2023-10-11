import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import VitePWA from "vite-plugin-pwa";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        VitePWA({
            registerType: "autoUpdate",
            devOptions: {
                enabled: true,
            },
            manifest: {
                name: "My App",
                short_name: "My App",
                start_url: ".",
                display: "standalone",
                background_color: "#ffffff",
                theme_color: "#FF5E3A",
                icons: [
                    {
                        src: "assets/img/pwa-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                ]
            },
            workbox: {
                globPatterns: ["**/*.{js,css,html,png,jpg,}"],
                runtimeCaching: [
                    {
                      urlPattern: new RegExp('^https://api.example.com/'),
                      handler: 'StaleWhileRevalidate',
                    },
                ],
            },
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
