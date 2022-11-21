import path from "path";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src/pages"),
            "~": path.resolve(__dirname, "src/components"),
        },
    },
    plugins: [solidPlugin()],
    server: {
        port: 3000,
        proxy: {
            "/api": {
                target: "http://127.0.0.1:8055",
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
    },
    build: {
        target: "esnext",
    },
});
