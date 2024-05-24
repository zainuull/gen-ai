import { NextRequest, NextResponse } from 'next/server';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { promises as fs } from 'fs';
import path from 'path';

// Initialize the Text-to-Speech client
const client = new TextToSpeechClient();

export async function POST(req: NextRequest) {
  const { text } = await req.json();
  console.log(text);

  if (!text) {
    return NextResponse.json({ message: 'Text is required' }, { status: 400 });
  }

  try {
    // Construct the request
    const request: any = {
      input: { text },
      voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: 'MP3' },
    };

    // Perform the Text-to-Speech request
    const [response]: any = await client.synthesizeSpeech(request);
    const audioContent = response.audioContent;
    const filePath = path.join(process.cwd(), 'public', 'output.mp3');

    // Write the binary audio content to a local file
    await fs.writeFile(filePath, audioContent, 'binary');

    return NextResponse.json({ message: 'Audio synthesized', url: '/output.mp3' }, { status: 200 });
  } catch (error) {
    console.error('Error synthesizing text:', error);
    return NextResponse.json({ message: 'Error synthesizing text' }, { status: 500 });
  }
}
