/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    outputFileTracingRoot: undefined,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["avatars.mds.yandex.net", "downloader.disk.yandex.ru", "disk.yandex.ru"],
    remotePatterns: [
      { protocol: "https", hostname: "**.yandex.net" },
      { protocol: "https", hostname: "**.yandex.ru" },
      { protocol: "https", hostname: "disk.yandex.ru" },
      { protocol: "https", hostname: "downloader.disk.yandex.ru" },
      { protocol: "https", hostname: "proxy.storage.yandex.net" },
      { protocol: "https", hostname: "*cloud-api.yandex.net" },
    ],
  },
}

export default nextConfig
