import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import babel from "vite-plugin-babel";

export default defineConfig({
  plugins: [
    react(),
    babel({
      babelConfig: {
        plugins: [
          [
            "import",
            {
              libraryName: "antd",
              libraryDirectory: "es",
              style: true,
            },
          ],
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          antd: ["antd", "@ant-design/icons"],
        },
      },
    },
  },
});
