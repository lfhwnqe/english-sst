// config/amplify-config.ts
import config from '@/aws-exports';
import { Amplify, ResourcesConfig } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';

// 配置 Amplify
Amplify.configure(config as ResourcesConfig);

// 生成 API 客户端
export const client = generateClient();
