const runtimeCaching = [
  {
    urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
    handler: "CacheFirst",
    options: {
      cacheName: "image-cache",
      expiration: {
        maxEntries: 100,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      },
      cacheableResponse: {
        statuses: [0, 200],
      },
    },
  },
  {
    urlPattern:
      /^https:\/\/[^/]+\.(?:cloudfront\.net|amazonaws\.com)\/.*\.(?:png|jpg|jpeg|svg|gif|webp)$/,
    handler: "CacheFirst",
    options: {
      cacheName: "cdn-image-cache",
      expiration: {
        maxEntries: 100,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      },
      cacheableResponse: {
        statuses: [0, 200],
      },
    },
  },
];

module.exports = runtimeCaching;
