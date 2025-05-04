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
      const scraper = file.replace('.json', '');
      
      // sort by startdate and !starttime
      const filteredData = jsonData.filter((item: any) => {
        return item.startdate && item.starttime;
      }
        ).sort((a: any, b: any) => {
          const dateA = new Date(a.startdate + 'T' + a.starttime);
          const dateB = new Date(b.startdate + 'T' + b.starttime);
          return dateA.getTime() - dateB.getTime();
        }
      );

      data[scraper] = filteredData;
    }
  }
  

  return NextResponse.json(data);
}
