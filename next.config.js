/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
    },
    basePath: '/visitedplaces', // Uncomment for GitHub Pages
    assetPrefix: '/visitedplaces/', // Uncomment for GitHub Pages
};

module.exports = nextConfig;
