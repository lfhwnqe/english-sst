/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "next-web",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    const bucket = new sst.aws.Bucket("MyBucket", {
      access: "public",
    });
    new sst.aws.Nextjs("MyWeb", {
      link: [bucket],
      server: {
        edge: {
          viewerRequest: {
            injection: `
              event.request.headers["x-custom-header"] = {
                value: "custom-value"
              };
            `,
          },
          viewerResponse: {
            injection: `
              event.response.headers["x-response-header"] = {
                value: "edge-processed"
              };
            `,
          },
        },
      },
    });
  },
});