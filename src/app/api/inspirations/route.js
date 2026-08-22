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
    const images = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => ({
        id: file,
        image_url: `/images/custom-nails-inspo/${file}`
      }));

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error reading inspirations directory:', error);
    return NextResponse.json({ error: 'Failed to load inspirations' }, { status: 500 });
  }
}
