// app/api/proxy/story/route.ts
export const runtime = 'nodejs'          // 允许 Edge/Node 任选，这里保留 Node

export async function POST(req: Request) {
  // 1) 构造克隆请求，保持流完整
  const backendURL =
    `${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001'}` +
    '/ai/stream/storytelling'

  const backendReq = new Request(backendURL, {
    method: req.method,                // 不写也可以，默认会克隆
    headers: req.headers,              // 包含 Cookie / Authorization 等鉴权信息
    body: req.body,                    // **保持 ReadableStream**
    duplex: 'half' as const            // node18 fetch 需要
  } as RequestInit)

  // 2) 发送并等待后端 Response（依旧是流）
  const backendRes = await fetch(backendReq)

  // 3) 复制响应头并补丁协议 / 鉴权头
  const headers = new Headers(backendRes.headers)
  if (!headers.has('x-vercel-ai-data-stream'))
    headers.set('x-vercel-ai-data-stream', 'v1')   // AI-SDK Data-Stream 协议
  // 你自己的其他鉴权或缓存控制也可在这里补
  headers.set('Cache-Control', 'no-cache')

  // 4) 直接把后端流返回给前端 (`useChat` 会继续解析)
  return new Response(backendRes.body, {
    status: backendRes.status,
    headers
  })
}
