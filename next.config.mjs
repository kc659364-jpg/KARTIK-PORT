/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  experimental: {
    cpus: 1,
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
