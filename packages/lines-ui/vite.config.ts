import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import dts from "vite-plugin-dts";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        solidPlugin(),
        dts({
            insertTypesEntry: true,
        }),
    ],
    build: {
        target: "esnext",
        lib: {
            entry: path.resolve(__dirname, "src/main.ts"),
            name: "lines-ui",
            formats: ["es", "umd"],
            fileName: (format) => `lines-ui.${format}.js`,
        },
    },
});
