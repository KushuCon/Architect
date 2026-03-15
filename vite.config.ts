import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const nvidiaBaseUrl = env.VITE_NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1";

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
      proxy: {
        "/api/nvidia": {
          target: nvidiaBaseUrl,
          changeOrigin: true,
          secure: true,
          rewrite: (pathValue) => pathValue.replace(/^\/api\/nvidia/, ""),
        },
      },
    },
    plugins: [react()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
