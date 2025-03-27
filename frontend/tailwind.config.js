// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Enables manual dark mode toggling
  theme: {
    extend: {
      colors: {
        dracula: {
          background: "#282a36",
          current: "#44475a",
          comment: "#6272a4",
          cyan: "#8be9fd",
          green: "#50fa7b",
          orange: "#ffb86c",
          pink: "#ff79c6",
          purple: "#bd93f9",
          red: "#ff5555",
          yellow: "#f1fa8c",
          white: "#f8f8f2",
        },
      },
    },
  },
  plugins: [],
};
  