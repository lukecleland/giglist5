import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Venue } from '@/app/types/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function GET(
  props: PageProps,
) {
  const { slug } = await props.params;

  try {
    const result = (await query(
      `SELECT * FROM gl_venues WHERE LOWER(slug) = ? LIMIT 1`,
      [slug.toLowerCase()]
    )) as Venue[];

    if (!result || result.length === 0) {
      return NextResponse.json({ error: 'Venue not found' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error fetching venue:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
