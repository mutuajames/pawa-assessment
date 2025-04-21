const rippleui = require("rippleui");

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // adjust based on your project
    "./node_modules/rippleui/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [rippleui],
};
