import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import Jimp from "jimp";
import GIFEncoder from "gifencoder";

function isFile(value: FormDataEntryValue): value is File {
  return value instanceof File;
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

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.promises.mkdir(uploadDir, { recursive: true });

    const images = await Promise.all(
      files.map(async (file) => {
        if (!isFile(file)) {
          throw new Error("All uploaded items must be files");
        }
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const image = await Jimp.read(buffer);

        // 调整图像尺寸为 800x600，确保传递的参数类型正确
        image.resize(Number(800), Number(600));
        return image;
      })
    );

    const width = 800;
    const height = 600;
    const encoder = new GIFEncoder(width, height);

    const gifPath = path.join(uploadDir, "output.gif");
    const gifStream = encoder
      .createReadStream()
      .pipe(fs.createWriteStream(gifPath));

    encoder.start();
    encoder.setRepeat(0); // 0 表示无限循环
    encoder.setDelay(500); // 每帧延迟 500 毫秒
    encoder.setQuality(10); // 图像质量

    for (const image of images) {
      // 获取图像的像素数据（RGBA 格式）
      const imageData = image.bitmap.data;

      // 将像素数据传递给 encoder
      encoder.addFrame(imageData as unknown as CanvasRenderingContext2D);
    }

    encoder.finish();

    // 等待 GIF 文件写入完成
    await new Promise<void>((resolve) => gifStream.on("finish", resolve));

    const gifUrl = "/uploads/output.gif";
    return NextResponse.json({ gifUrl });
  } catch (error) {
    console.error("Error creating GIF:", error);
    return NextResponse.json(
      { error: "Failed to create GIF" },
      { status: 500 }
    );
  }
}
