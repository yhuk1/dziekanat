import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#18202f",
        paper: "#f7f3ea",
        ledger: "#e7ddc8",
        accent: "#2f7d7e",
        warning: "#c65f3a",
        success: "#4f7f45",
      },
      boxShadow: {
        panel: "0 18px 50px rgba(24, 32, 47, 0.14)",
      },
    },
  },
  plugins: [],
};

export default config;
