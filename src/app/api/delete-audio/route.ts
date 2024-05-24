// api/deleteAudioFile.ts
import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function DELETE(req: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'output.mp3');
    await fs.unlink(filePath);
    return NextResponse.json({ message: 'Audio file deleted' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting audio file:', error);
    return NextResponse.json({ message: 'Error deleting audio file' }, { status: 500 });
  }
}
