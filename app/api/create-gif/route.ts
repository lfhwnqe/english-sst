import { NextResponse } from "next/server";
import Jimp from "jimp";
import GIFEncoder from "gifencoder";
import { Readable } from "stream";

function isFile(value: FormDataEntryValue): value is File {
  return value instanceof File;
}

// 使用推荐的 Buffer 方法重写 streamToBuffer
async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("images");

    if (!files?.length || files.length < 2) {
      return NextResponse.json(
        { error: "At least 2 images are required" },
        { status: 400 }
      );
    }

    // 处理上传的图片
    const images = await Promise.all(
      files.map(async (file) => {
        if (!isFile(file)) {
          throw new Error("All uploaded items must be files");
        }
        const bytes = await file.arrayBuffer();
        // 使用 Buffer.from 替代旧的 Buffer 构造函数
        const buffer = Buffer.from(bytes);
        const image = await Jimp.read(buffer);
        
        // 调整图像尺寸
        image.resize(800, 600);
        return image;
      })
    );

    // 设置 GIF 编码器
    const width = 800;
    const height = 600;
    const encoder = new GIFEncoder(width, height);
    
    // 创建一个可读流来接收 GIF 数据
    const gifStream = encoder.createReadStream();
    
    // 开始编码过程
    encoder.start();
    encoder.setRepeat(0); // 无限循环
    encoder.setDelay(500); // 每帧延迟 500 毫秒
    encoder.setQuality(10); // 图像质量

    // 添加所有帧
    for (const image of images) {
      encoder.addFrame(image.bitmap.data as unknown as CanvasRenderingContext2D);
    }
    
    encoder.finish();

    // 将 GIF 流转换为 buffer
    const gifBuffer = await streamToBuffer(gifStream);
    
    // 返回 base64 格式的 GIF 数据
    return NextResponse.json({ 
      gifData: `data:image/gif;base64,${gifBuffer.toString('base64')}` 
    });

  } catch (error) {
    console.error("Error creating GIF:", error);
    return NextResponse.json(
      { error: "Failed to create GIF" },
      { status: 500 }
    );
  }
}