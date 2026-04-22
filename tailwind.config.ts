import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        os: {
          bg: "#0b0e11",
          surface: "#141619",
          "surface-2": "#1a1d21",
          "surface-3": "#24272c",
          border: "#2a2d33",
          "border-light": "#363a41",
          text: "#ffffff",
          "text-secondary": "#8a919e",
          "text-tertiary": "#5b616e",
          blue: "#2081e2",
          green: "#34c759",
          red: "#eb5757",
        },
      },
    },
  },
  plugins: [],
};

export default config;
