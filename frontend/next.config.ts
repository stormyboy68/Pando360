import type { NextConfig } from "next";

const nextConfig: { output: string; experimental: { serverActions: boolean } } = {
    output: 'standalone',
    experimental: {
        serverActions: true
    }
};

export default nextConfig;