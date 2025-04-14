import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Specify the directory where files will be stored
const uploadDir = path.join(process.cwd(), 'public', 'images');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function POST(request: Request) {
  try {
    // Get the form data from the request
    const formData = await request.formData();
    const file = formData.get('file') as Blob;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Create a unique filename for the uploaded file
    const filename = `${Date.now()}_${file.name}`;
    const filePath = path.join(uploadDir, filename);

    // Convert the file to a buffer and write it to the specified location
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Write the file to the /public/images directory
    fs.writeFileSync(filePath, new Uint8Array(buffer));

    // Return the file URL as the response
    const fileUrl = `/images/${filename}`;
    return NextResponse.json({ fileUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 });
  }
}
