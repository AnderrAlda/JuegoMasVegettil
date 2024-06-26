/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "pub-0ac36a8b24eb4133942d20338a06e753.r2.dev",
                protocol: "https",
                port: "",
            }
        ]
    },
    async headers() {
        return [
            {
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: "*" },
                    { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
                    { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
                    { key: "Access-Control-Expose-Headers", value: "Content-Length, X-JSON" },
                    { key: "Access-Control-Max-Age", value: "86400" },
                ],
            },
        ];
    },
};

export default nextConfig;
