import { NextResponse } from "next/server";

// 免费可用的模型列表
const FREE_MODELS = [
  {
    id: "microsoft/mai-ds-r1:free",
    name: "Mai DS R1",
    description: "微软研发的免费可用模型，适合测试和开发使用",
    provider: "Microsoft",
    maxTokens: 163840,
    category: "chat",
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    models: FREE_MODELS,
  });
}
