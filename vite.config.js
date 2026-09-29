import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  // O GitHub Pages serve o site em /EuSouTT/, não na raiz do domínio. Com base
  // relativa os caminhos do build (JS, CSS, favicon) funcionam em qualquer
  // subpasta — e continuam funcionando se um domínio próprio entrar depois.
  base: "./",
  plugins: [react(), tailwindcss()],
});
