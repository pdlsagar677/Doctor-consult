import type { NextConfig } from "next";
import fs from "fs";

const isLocal = process.env.NODE_ENV === "development";

let devServerConfig = {};

if (isLocal) {
  try {
    devServerConfig = {
      devServer: {
        https: {
          key: fs.readFileSync("./localhost+1-key.pem"),
          cert: fs.readFileSync("./localhost+1.pem"),
        },
        host: "0.0.0.0",
      },
    };
  } catch {
    console.warn("⚠️ HTTPS cert files not found locally — using HTTP instead");
  }
}

const nextConfig: NextConfig = {
  experimental: {},
  ...devServerConfig,
};

export default nextConfig;
