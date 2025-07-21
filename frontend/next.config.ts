/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                // Это правило разрешает картинки с API PandaScore
                protocol: 'https',
                hostname: 'cdn.pandascore.co',
            },
            {
                protocol: 'https',
                hostname: '**', // '**' означает "разрешить любой хост"
            },
            {
                protocol: 'http',
                hostname: '**', // Делаем то же самое и для http
            },

             // {
             //   protocol: 'http',
             //   hostname: 'localhost',
             //   port: '8000',
             // },
        ],
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'ALLOW-FROM https://vk.com/', // Разрешаем встраивание для vk.com
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: "frame-ancestors 'self' *.vk.com *.vk-cdn.net *.vkforms.com;", // Более современный аналог
                    }
                ],
            },
        ];
    },
};
export default nextConfig;
module.exports = nextConfig;