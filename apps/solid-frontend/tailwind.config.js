/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,css,md,mdx,html,json,scss}"],
    darkMode: "class",
    theme: {
        extend: {},
    },
    plugins: [require("@tailwindcss/typography"), require("daisyui")],
    daisyui: {
        darkTheme: "lines-dark",
        themes: [
            {
                "lines-dark": {
                    primary: "#EF9A11",
                    secondary: "#EF9A11",
                    accent: "#EF9A11",
                    neutral: "#262827",
                    "base-100": "#262827",
                    "base-200": "#1D1F1E",
                    "base-300": "#151616",
                },
            },
            {
                "lines-light": {
                    primary: "#EF9A11",
                    secondary: "#EF9A11",
                    accent: "#EF9A11",
                    neutral: "#FFFFFF",
                    "base-100": "#FFFFFF",
                    "base-200": "#EEEEEE",
                    "base-300": "#D2D2D2",
                },
            },
        ],
    },
};
