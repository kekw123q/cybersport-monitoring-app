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
};
export default nextConfig;
module.exports = nextConfig;