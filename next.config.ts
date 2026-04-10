const nextConfig = {
  allowedDevOrigins: [
    '192.168.1.69',
    '.ngrok.io', // optional but useful
  ],
  async rewrites() {
    return [
      {
        source: '/api/reports/:path*',
        destination: 'https://dtinterpreting.video*',
      },
    ];
  },
};

export default nextConfig;