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
    const cognitoRegion = aws.getRegionOutput().name || "";
    console.log("region:", cognitoRegion);

    // 增加用户池
    // const userPool = new sst.aws.CognitoUserPool("MyUserPool");
    // new sst.aws.CognitoUserPool("MyUserPool", {
    //   usernames: ["email"],
    // });
    // userPool.addClient("MyWeb");
    const userPool = new sst.aws.CognitoUserPool("MyUserPool", {
      usernames: ["email"],
    });

    const client = userPool.addClient("MyUserClient", {
      transform: {
        client: {
          explicitAuthFlows: ["USER_PASSWORD_AUTH"]
        }
      }
    });

    const bucket = new sst.aws.Bucket("MyBucket", {
      access: "public",
    });
    new sst.aws.Nextjs("MyWeb", {
      environment: {
        COGNITO_REGION: cognitoRegion,
      },
      domain: {
        name: "mn.maomaocong.site",
        dns: sst.cloudflare.dns(),
      },
      link: [bucket, userPool, client],
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
