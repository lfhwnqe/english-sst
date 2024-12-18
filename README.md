# 基于sst的nextjs项目

使用aws进行部署，cloudflared进行cdn

## Getting Started
设置cloudflare的api token

cloudflare.js中 
```js
export API_TOKEN=****
```
终端设置cloudflare的account id
```shell
export CLOUDFLARE_DEFAULT_ACCOUNT_ID=****
```
开发环境直连本地localhost:3001
开发命令
```shell
pnpm run dev:sst
```
发布命令
```shell
pnpm run publish:prod
```
