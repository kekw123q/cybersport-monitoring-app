/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    async headers() {
        return [
            {
                // Применяем эти заголовки ко всем роутам в приложении
                source: '/:path*',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'ALLOW-FROM https://vk.com/', // Старый способ, менее поддерживаемый
                    },
                    {
                        key: 'Content-Security-Policy',
                        // Это современный и правильный способ.
                        // Он разрешает встраивание вашего сайта в iframe на указанных доменах.
                        value: "frame-ancestors 'self' *.vk.com *.vk-cdn.net *.vkforms.com;",
                    },
                ],
            },
        ];
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