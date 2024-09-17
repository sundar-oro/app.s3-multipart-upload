/** @type {import('next').NextConfig} */
const nextConfig = {
    /** @type {import('next').NextConfig} */
    reactStrictMode: true,
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 's3.us-east-005.backblazeb2.com',
            },
        ],
    },
};
export default nextConfig;