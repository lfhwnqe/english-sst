/// <reference path="./.sst/platform/config.d.ts" />
import { API_TOKEN } from "./cloudflare";
export default $config({
  app(input) {
    return {
      name: "next-web",
      stage: input?.stage || "dev", // 确保有默认的 stage
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        cloudflare: {
          apiToken: API_TOKEN,
        },
      },
    };
  },
  async run() {
    const bucket = new sst.aws.Bucket("MyBucket", {
      access: "public",
    });
    new sst.aws.Nextjs("MyWeb", {
      domain: {
        name: "mn.maomaocong.site",
        dns: sst.cloudflare.dns(),
      },
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
