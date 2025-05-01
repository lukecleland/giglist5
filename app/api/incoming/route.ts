import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { IncomingData } from '@/app/types/types';

export async function GET() {
  const data: IncomingData = {};

  const dirPath = path.join(process.cwd(), 'app/gigtools/data');
  const files = await fs.readdir(dirPath);

  for (const file of files) {
    if (file.endsWith('.json')) {
      const filePath = path.join(dirPath, file);
      const fileContents = await fs.readFile(filePath, 'utf-8');
      const jsonData = JSON.parse(fileContents);
      data[file.replace('.json', '')] = jsonData;
    }
  }

  return NextResponse.json(data);
}
