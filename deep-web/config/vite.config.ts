import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import pluginChecker from "vite-plugin-checker";
import viteTsconfigPaths from "vite-tsconfig-paths";
import Image from "@rollup/plugin-image";
import tailwindcss from "tailwindcss";
import { compression } from "vite-plugin-compression2";

const PORT = Number(process.env.VITE_PORT) || 3000;

const manualChunks = {
  reactLibs: ["react", "react-dom", "react-router-dom"],
  radixLibs: [
    "@radix-ui/react-tooltip",
    "@radix-ui/react-toast",
    "@radix-ui/react-slot",
    "@radix-ui/react-separator",
    "@radix-ui/react-dropdown-menu",
  ],
};

export default defineConfig({
  plugins: [
    {
      ...Image(),
      enforce: "pre",
    },
    react(),
    pluginChecker({ typescript: true, overlay: true }),
    viteTsconfigPaths(),
    compression(),
  ],
  build: {
    outDir: "build",
    sourcemap: false,
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: "[name].[hash].js",
        chunkFileNames: "[name].[hash].js",
        assetFileNames: "[name].[hash].[ext]",
        manualChunks,
      },
    },
  },
  server: {
    host: true,
    open: true,
    port: PORT,
  },
  preview: {
    host: true,
    open: true,
    port: 4173,
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  optimizeDeps: {
    include: ["react", "@radix-ui/*", "axios"],
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
});
