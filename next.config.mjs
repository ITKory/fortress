/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ["avatars.mds.yandex.net", "downloader.disk.yandex.ru"],
    remotePatterns: [
      { protocol: "https", hostname: "**.yandex.net" },
      { protocol: "https", hostname: "downloader.disk.yandex.ru" },
      { protocol: "https", hostname: "proxy.storage.yandex.net" },
      { protocol: "https", hostname: "*cloud-api.yandex.net" },
    ],

  },
}

export default nextConfig
