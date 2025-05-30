"use client";

import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  InfoWindow,
  MarkerClusterer,
} from "@react-google-maps/api";
import React, { use, useCallback, useEffect, useMemo, useState } from "react";
import { Listing, Venue } from "@/app/types/types";
import { format, addDays, subMonths } from "date-fns";
import { specialElite } from "@/config/fonts";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { darkMapStyle, lightMapStyle } from "./styles";

const formatDate = (date: Date) => {
  return format(date, "yyyy-MM-dd");
};

const containerStyle: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
};

const center = { lat: -31.9505, lng: 115.8605 };

type LatLngLiteral = google.maps.LatLngLiteral;

export const GigMap = ({ gigs }: { gigs: (Listing & Venue)[] }) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedGig, setSelectedGig] = useState<(Listing & Venue) | null>(
    null
  );
  const [shouldFitBounds, setShouldFitBounds] = useState(true);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [initialBounds, setInitialBounds] =
    useState<google.maps.LatLngBounds | null>(null);
  const [viewChanged, setViewChanged] = useState(false);
  const [initialCenter, setInitialCenter] = useState<LatLngLiteral | null>(
    null
  );
  const [initialZoom, setInitialZoom] = useState<number | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
  });

  const { theme } = useTheme();

  const mapOptions = useMemo(
    () => ({
      styles: theme === "dark" ? darkMapStyle : lightMapStyle,
      disableDefaultUI: true,
      gestureHandling: "greedy",
    }),
    [theme]
  );

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      setMap(map);

      map.addListener("bounds_changed", () => {
        if (!initialBounds) return;

        const currentBounds = map.getBounds();
        if (!currentBounds) return;

        const changed = !currentBounds.equals(initialBounds);
        setViewChanged(changed);
      });
    },
    [initialBounds]
  );

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const filteredGigs = useMemo(() => {
    return gigs.filter((gig) => {
      const gigDate = new Date(gig.startdate);
      return formatDate(gigDate) === formatDate(currentDate);
    });
  }, [gigs, currentDate]);

  useEffect(() => {
    if (!map || !filteredGigs.length || !shouldFitBounds) return;

    const bounds = new google.maps.LatLngBounds();
    filteredGigs.forEach((v) =>
      bounds.extend({ lat: Number(v.lat), lng: Number(v.lng) })
    );

    map.fitBounds(bounds);
    setShouldFitBounds(false);

    // Save the initial bounds after first load
    if (!initialBounds) {
      setInitialBounds(bounds);
    }
  }, [map, filteredGigs, shouldFitBounds, initialBounds]);

  const handlePrev = () => setCurrentDate((d) => addDays(d, -1));
  const handleNext = () => setCurrentDate((d) => addDays(d, 1));

  return isLoaded ? (
    <>
      <div
        className={clsx(
          specialElite.className,
          "absolute top-20 left-10 z-10 bg-white dark:bg-black text-black dark:text-white shadow-md rounded-full px-4 py-2 flex items-center space-x-4 text-sm font-medium"
        )}
      >
        <button onClick={handlePrev} className="hover:underline">
          ◀
        </button>
        <span className="w-[200px]">
          {format(currentDate, "eeee, MMMM do")}
        </span>
        <button onClick={handleNext} className="hover:underline">
          ▶
        </button>
      </div>

      {/* should rely on viewChnaged */}
      <div className="absolute top-[80px] right-0 transform -translate-x-1/2 z-10">
        <button
          onClick={() => setShouldFitBounds(true)}
          className={clsx(
            specialElite.className,
            "text-xs bg-gray-800 text-white px-3 py-1 rounded-full shadow-md hover:bg-gray-700 transition"
          )}
        >
          Reset View
        </button>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        <MarkerClusterer
          options={{
            styles: [
              {
                url: "/marker.svg",
                height: 40,
                width: 40,
                textColor: "white",
                textSize: 14,
                anchorText: [0, 0],
              },
            ],
          }}
        >
          {(clusterer) => (
            <>
              {filteredGigs.map((gig) => (
                <Marker
                  key={gig.id}
                  position={{ lat: Number(gig.lat), lng: Number(gig.lng) }}
                  title={gig.name}
                  clusterer={clusterer}
                  icon={{
                    url: "/marker.svg",
                    scaledSize: new google.maps.Size(14, 14),
                  }}
                  onClick={() => setSelectedGig(gig)}
                />
              ))}
            </>
          )}
        </MarkerClusterer>

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
    </>
  ) : null;
};
