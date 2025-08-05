import { NextRequest, NextResponse } from "next/server";
import { selectVenues, getVenueCount } from "@/app/gigtools/api/queries-optimized";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");

  try {
    const [venuesResult, total] = await Promise.all([
      selectVenues(limit, offset),
      getVenueCount()
    ]);
    
    const venues = JSON.parse(venuesResult);
    
    return NextResponse.json({
      venues,
      total,
      limit,
      offset,
      hasMore: offset + limit < total
    });
  } catch (error) {
    console.error("Error fetching venues:", error);
    return NextResponse.json({ error: "Failed to fetch venues" }, { status: 500 });
  }
}
