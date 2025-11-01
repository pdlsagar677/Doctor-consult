import type { NextConfig } from "next";
import fs from "fs";

const nextConfig: NextConfig = {
  experimental: {
    allowedDevOrigins: ["https://192.168.1.74:3000"],
  },
  devServer: {
    https: {
      key: fs.readFileSync("./localhost+1-key.pem"),
      cert: fs.readFileSync("./localhost+1.pem"),
    },
    host: "0.0.0.0",
  },
};

export default nextConfig;
