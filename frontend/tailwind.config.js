export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        ink: "#05050a",
        panel: "rgba(16, 18, 31, 0.72)",
        line: "rgba(255,255,255,0.10)"
      },
      boxShadow: {
        glow: "0 20px 70px rgba(94, 92, 230, 0.28)"
      }
    }
  },
  plugins: []
};
