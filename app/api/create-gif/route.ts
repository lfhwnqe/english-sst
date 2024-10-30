import { createCanvas, createImageData } from "canvas";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import GIFEncoder from "gifencoder";
import sharp from "sharp";
import fs from "fs";

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

    const imagePaths = await Promise.all(
      files.map(async (file, index) => {
        if (!isFile(file)) {
          throw new Error("All uploaded items must be files");
        }
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `image-${Date.now()}-${index}.png`;
        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);
        return filepath;
      })
    );

    const encoder = new GIFEncoder(800, 600);
    const gifPath = path.join(uploadDir, "output.gif");
    const gifStream = encoder
      .createReadStream()
      .pipe(fs.createWriteStream(gifPath));

    encoder.start();
    encoder.setRepeat(0);
    encoder.setDelay(500);
    encoder.setQuality(10);

    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext("2d");

    for (const imagePath of imagePaths) {
      const { data, info } = await sharp(imagePath)
        .resize(800, 600, {
          fit: "contain",
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .raw()
        .toBuffer({ resolveWithObject: true });

      const imageData = createImageData(
        new Uint8ClampedArray(data),
        info.width,
        info.height
      );
      ctx.putImageData(imageData, 0, 0);
      encoder.addFrame(ctx as unknown as CanvasRenderingContext2D);

      await fs.promises.unlink(imagePath);
    }

    encoder.finish();

    await new Promise((resolve) => gifStream.on("finish", resolve));

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
