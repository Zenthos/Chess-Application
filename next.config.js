const withPlugins = require('next-compose-plugins');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = {
  ...withPlugins(
    [withBundleAnalyzer],
    {},
  ),
  images: {
    domains: ['picsum.photos'],
  },
  async redirects() {
    return [
      {
        source: '/forum',
        destination: '/forum/hub',
        permanent: false,
      },
    ]
  },
};
