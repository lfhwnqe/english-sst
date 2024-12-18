// configs/index.ts

interface Config {
  apiUrl: string;
  // 其他环境相关配置...
}

const configs: Record<string, Config> = {
  developent: {
    apiUrl: "http://localhost:3001",
  },
  prod: {
    apiUrl: "https://c2526nxklc.execute-api.us-east-2.amazonaws.com/dev/",
  },
};

export const getConfig = () => {
  const stage = process.env.NEXT_PUBLIC_STAGE || "developent";
  return configs[stage];
};
