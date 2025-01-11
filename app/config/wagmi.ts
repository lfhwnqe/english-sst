import { http, createConfig } from "wagmi";
import { sepolia, hardhat } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

// 定义本地 Hardhat 网络
const localHardhat = {
  ...hardhat,
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545'],
    },
    public: {
      http: ['http://127.0.0.1:8545'],
    },
  },
} as const;

export const config = createConfig({
  chains: [sepolia, localHardhat],
  ssr: true,
  transports: {
    [sepolia.id]: http(),
    [localHardhat.id]: http('http://127.0.0.1:8545'),
  },
  connectors: [metaMask()],
});
