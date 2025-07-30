/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
    },
    // Use basePath only in production (GitHub Pages)
    ...(process.env.NODE_ENV === 'production' && {
        basePath: '/visitedplaces',
        assetPrefix: '/visitedplaces/',
    }),
};

module.exports = nextConfig;
