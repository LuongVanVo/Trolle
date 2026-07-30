import path from "path"
import fs from "fs"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

function copyBuildPlugin() {
  return {
    name: 'copy-build-plugin',
    closeBundle() {
      const srcDir = path.resolve(__dirname, 'dist/react-app');
      const distDir = path.resolve(__dirname, 'dist');
      if (fs.existsSync(srcDir)) {
        fs.cpSync(srcDir, distDir, { recursive: true });
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), copyBuildPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: '/react-app/',
  build: {
    outDir: 'dist/react-app'
  }
})