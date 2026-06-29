import { defineConfig } from "cypress";

export default defineConfig({
  allowCypressEnv: false,
  e2e: {
    baseUrl: "http://localhost:5173/print-puz-react-vite/",
    setupNodeEvents(/* on, config */) {
      // implement node event listeners here
    },
  },
});
