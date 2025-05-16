"use client";

import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  InfoWindow,
} from "@react-google-maps/api";
import React, { useCallback, useEffect, useState } from "react";
import { styles } from "../styles";
import { Listing, Venue } from "@/app/types/types";

const containerStyle: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
};

const center = { lat: -31.9505, lng: 115.8605 };

export const GigMap = ({ gigs }: { gigs: (Listing & Venue)[] }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedGig, setSelectedGig] = useState<(Listing & Venue) | null>(
    null
  );

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  useEffect(() => {
    if (!map || !gigs?.length) return;

    const bounds = new google.maps.LatLngBounds();
    gigs.forEach((v) =>
      bounds.extend({ lat: Number(v.lat), lng: Number(v.lng) })
    );

    map.fitBounds(bounds);
  }, [map, gigs]);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        styles,
        disableDefaultUI: true,
        gestureHandling: "greedy",
      }}
    >
      {gigs.map((gig) => (
        <Marker
          key={gig.id}
          position={{ lat: Number(gig.lat), lng: Number(gig.lng) }}
          title={gig.name}
          onClick={() => setSelectedGig(gig)}
        />
      ))}

      {selectedGig && (
        <InfoWindow
          position={{
            lat: Number(selectedGig.lat),
            lng: Number(selectedGig.lng),
          }}
          onCloseClick={() => setSelectedGig(null)}
        >
          <div>
            <h4 className="text-sm font-semibold">{selectedGig.name}</h4>
            <p className="text-xs text-gray-600">More info can go here...</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  ) : null;
};
