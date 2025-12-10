/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  output: 'standalone', // Enable standalone output for Docker
  env: {
    QMS_API_URL: process.env.QMS_API_URL || 'https://qms-agent-728802725258.us-central1.run.app',
  },
}

module.exports = nextConfig