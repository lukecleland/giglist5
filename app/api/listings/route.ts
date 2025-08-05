import { NextRequest, NextResponse } from "next/server";
import { getListings } from "@/app/gigtools/api/queries-optimized";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "100");
  const showHistorical = searchParams.get("historical") === "true";

  try {
    const listings = await getListings(limit, showHistorical);
    return NextResponse.json(listings);
  } catch (error) {
    console.error("Error fetching listings:", error);
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 });
  }
}
