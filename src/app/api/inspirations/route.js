import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const dirPath = path.join(process.cwd(), 'public', 'images', 'custom-nails-inspo');
    
    if (!fs.existsSync(dirPath)) {
      return NextResponse.json({ images: [] });
    }

    const files = fs.readdirSync(dirPath);
    
    // Filter out non-image files if necessary, and create public URLs
    // Filter out non-image files if necessary, and create public URLs
    let images = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => ({
        id: file,
        image_url: `/images/custom-nails-inspo/${file}`
      }));

    // Shuffle array using Fisher-Yates algorithm
    for (let i = images.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [images[i], images[j]] = [images[j], images[i]];
    }

    // Duplicate array 4 times for pseudo-infinite scroll effect
    const infiniteImages = [];
    for (let i = 0; i < 4; i++) {
      infiniteImages.push(...images.map(img => ({
        ...img,
        id: `${img.id}-${i}` // ensure unique keys for React
      })));
    }

    return NextResponse.json({ images: infiniteImages });
  } catch (error) {
    console.error('Error reading inspirations directory:', error);
    return NextResponse.json({ error: 'Failed to load inspirations' }, { status: 500 });
  }
}
