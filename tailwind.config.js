/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        surface2: "var(--surface2)",
        text: "var(--text)",
        text2: "var(--text2)",
        muted: "var(--muted)",
        border: "var(--border)",
        borderStrong: "var(--borderStrong)",
        brandGreen: "var(--brandGreen)",
        brandGreen2: "var(--brandGreen2)",
        brandLime: "var(--brandLime)",
        brandDeep: "var(--brandDeep)",
        accentBlue: "var(--accentBlue)",
        accentPurple: "var(--accentPurple)",
        accentRed: "var(--accentRed)",
        accentOrange: "var(--accentOrange)",
        accentYellow: "var(--accentYellow)",
      },
      boxShadow: {
        sm: "var(--shadowSm)",
        md: "var(--shadowMd)",
        lg: "var(--shadowLg)",
        focus: "0 0 0 3px var(--focus)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        large: "32px",
      },
    },
  },
  plugins: [],
}
