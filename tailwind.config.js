module.exports = {
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    extend: {
      colors: {
        linkedin: {
          primary: "#0A66C2",
          lighter: "#378fe9",
          darker: "#004182",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
  content: ["node_modules/tailvue/dist/tailvue.es.js"],
};
