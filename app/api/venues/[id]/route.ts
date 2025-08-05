import { NextRequest, NextResponse } from "next/server";
import { selectVenue } from "@/app/gigtools/api/queries-optimized";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const venueId = parseInt(id);

  if (isNaN(venueId)) {
    return NextResponse.json({ error: "Invalid venue ID" }, { status: 400 });
  }

  try {
    const venue = await selectVenue(venueId);
    
    if (!venue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }
    
    return NextResponse.json(venue);
  } catch (error) {
    console.error("Error fetching venue:", error);
    return NextResponse.json({ error: "Failed to fetch venue" }, { status: 500 });
  }
}
