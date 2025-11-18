/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "downloader.disk.yandex.ru" },
      { protocol: "https", hostname: "pst.yandex.ru" },
      { protocol: "https", hostname: "avatars.mds.yandex.net" },
    ],
  },

      experimental: {
        largePageDataBytes: 5 * 1024 * 1024,
      },
};

export default nextConfig;
