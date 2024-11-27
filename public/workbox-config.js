const runtimeCaching = [
  {
    urlPattern: /^https:\/\/nuo-english\.s3\.us-east-2\.amazonaws\.com\/.*/,
    handler: "CacheFirst",
    options: {
      cacheName: "audio-cache",
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      },
      cacheableResponse: {
        statuses: [0, 200],
      },
      rangeRequests: true,
    },
  },
];

module.exports = runtimeCaching;
