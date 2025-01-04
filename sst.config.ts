/// <reference path="./.sst/platform/config.d.ts" />
import { API_TOKEN } from "./cloudflare";
export default $config({
  app(input) {
    return {
      name: "mmc-frontend",
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
    // 获取当前 stage
    console.log("Current stage:", $app.stage);
    new sst.aws.Nextjs("mmc-frontend", {
      environment: {
        STAGE: $app.stage, // 将 stage 传递给 Next.js 应用
      },
      domain: {
        name: "mmc.maomaocong.site",
        dns: sst.cloudflare.dns(),
      },
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
