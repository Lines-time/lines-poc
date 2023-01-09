/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,css,md,mdx,html,json,scss}"],
    darkMode: "class",
    theme: {
        extend: {
            fontFamily: {
                secular: ["Secular One", "sans-serif"],
                rubik: ["Rubik", "sans-serif"],
            },
        },
    },
    plugins: [require("@tailwindcss/typography"), require("daisyui")],
    daisyui: {
        darkTheme: "lines-dark",
        themes: [
            {
                "lines-dark": {
                    primary: "#EF9A11",
                    secondary: "#6387c1",
                    accent: "#EF9A11",
                    neutral: "#212430",
                    "base-100": "#212430",
                    "base-200": "#1A1D26",
                    "base-300": "#15171F",
                },
            },
            {
                "lines-light": {
                    primary: "#EF9A11",
                    secondary: "#6387c1",
                    accent: "#EF9A11",
                    neutral: "#DFDFDF",
                    "base-100": "#DFDFDF",
                    "base-200": "#EEEEEE",
                    "base-300": "#FFFFFF",
                },
            },
        ],
    },
};
