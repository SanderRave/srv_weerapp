const { override, addWebpackPlugin } = require('customize-cra');
const { GenerateSW } = require('workbox-webpack-plugin');

module.exports = override(
  addWebpackPlugin(
    new GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      // Customize the following options based on your needs:
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB cache limit per file
      runtimeCaching: [
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
            },
          },
        },
        {
          urlPattern: new RegExp('https://api.yourservice.com/'),
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            networkTimeoutSeconds: 10,
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 5 * 60, // 5 minutes
            },
          },
        },
      ],
    })
  )
);
