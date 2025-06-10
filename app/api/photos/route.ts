import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const photosDir = path.join(process.cwd(), 'public', 'photos');
    
    // Check if directory exists
    if (!fs.existsSync(photosDir)) {
      return NextResponse.json([]);
    }

    // Read directory contents
    const files = fs.readdirSync(photosDir);
    
    // Filter for image files
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
    });

    return NextResponse.json(imageFiles);
  } catch (error) {
    console.error('Error reading photos directory:', error);
    return NextResponse.json({ error: 'Failed to read photos directory' }, { status: 500 });
  }
} 