// app/api/create-gif/route.js
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import GIFEncoder from 'gifencoder';
import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('images');

    if (!files?.length || files.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 images are required' },
        { status: 400 }
      );
    }

    

    // Create temporary directory for uploaded files
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.promises.mkdir(uploadDir, { recursive: true });

    // Save uploaded files and get their paths
    const imagePaths = await Promise.all(
      files.map(async (file: any, index: any) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `image-${Date.now()}-${index}.png`;
        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);
        return filepath;
      })
    );

    // Create GIF
    const encoder = new GIFEncoder(800, 600);
    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext('2d');

    // Start encoding
    encoder.createReadStream().pipe(fs.createWriteStream(path.join(uploadDir, 'output.gif')));
    encoder.start();
    encoder.setRepeat(0);   // 0 for repeat, -1 for no-repeat
    encoder.setDelay(500);  // frame delay in ms
    encoder.setQuality(10); // image quality. 10 is default.

    // Add frames
    for (const imagePath of imagePaths) {
      const image = await loadImage(imagePath);
      ctx.drawImage(image, 0, 0, 800, 600);
      encoder.addFrame(ctx);
      // Clean up temporary image file
      await fs.promises.unlink(imagePath);
    }

    encoder.finish();

    // Return the URL of the generated GIF
    const gifUrl = '/uploads/output.gif';
    
    return NextResponse.json({ gifUrl });
  } catch (error) {
    console.error('Error creating GIF:', error);
    return NextResponse.json(
      { error: 'Failed to create GIF' },
      { status: 500 }
    );
  }
}