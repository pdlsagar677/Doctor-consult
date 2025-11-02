import type { NextConfig } from "next";
import fs from "fs";

const isLocal = process.env.NODE_ENV === "development" && !process.env.VERCEL;

const nextConfig: NextConfig = {
  experimental: {},
  ...(isLocal && {
    devServer: {
      https: {
        key: fs.readFileSync("./localhost+1-key.pem"),
        cert: fs.readFileSync("./localhost+1.pem"),
      },
      host: "0.0.0.0",
    },
  }),
};

export default nextConfig;
