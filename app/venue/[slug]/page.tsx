"use client";

import { Venue } from "@/app/types/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VenuesPage() {
  const { slug } = useParams();
  const [venue, setVenue] = useState<Venue | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchVenue = async () => {
      const res = await fetch(`/api/venues/${slug}`);
      if (!res.ok) {
        setVenue(null);
        return;
      }

      const venueData = await res.json();
      setVenue(venueData);
    };

    fetchVenue();
  }, [slug]);

  if (!venue) return <div>Loading or venue not found...</div>;

  return (
    <div>
      <img src={venue.heroImage} alt={venue.name} />
      <h1>{venue.name}</h1>
      <p>ID: {venue.id}</p>
      <p>Slug: {venue.slug}</p>
      <p>Address: {venue.address1}</p>
      <p>Suburb: {venue.suburb}</p>
      <p>State: {venue.state}</p>
      <p>Postcode: {venue.postcode}</p>
      <p>URL: {venue.url}</p>
      <p>Email: {venue.email}</p>
      <p>Phone: {venue.phone}</p>
      <div>
        Description:{" "}
        <div dangerouslySetInnerHTML={{ __html: venue.description }} />
      </div>
    </div>
  );
}
