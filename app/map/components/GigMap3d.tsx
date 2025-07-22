/*
  Next.js-compatible ArcGIS 3D SceneView for visualizing Giglist Gigs (Listing & Venue combined)
*/

"use client";

import { useEffect, useRef } from "react";
import { loadModules } from "esri-loader";
import { Listing, Venue } from "@/app/types/types";

export const GigMap3d = ({ gigs }: { gigs: (Listing & Venue)[] }) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  if (!gigs.length) return <div>Loading gigs...</div>;

  const mapRef = useRef(null);

  useEffect(() => {
    if (!gigs.length || !mapRef.current) return;

    loadModules(
      [
        "esri/Map",
        "esri/views/SceneView",
        "esri/layers/GraphicsLayer",
        "esri/Graphic",
        "esri/widgets/TimeSlider",
      ],
      { css: true }
    ).then(([ArcGISMap, SceneView, GraphicsLayer, Graphic, TimeSlider]) => {
      const map = new ArcGISMap({
        basemap: "dark-gray-vector",
        ground: "world-elevation",
      });

      const view = new SceneView({
        container: mapRef.current,
        map,
        camera: {
          position: {
            latitude: -33.8688,
            longitude: 151.2093,
            z: 10000,
          },
          tilt: 60,
        },
      });

      const graphicsLayer = new GraphicsLayer();
      map.add(graphicsLayer);

      gigs.forEach((gig) => {
        if (!gig.lat || !gig.lng) return;

        const point = {
          type: "point",
          longitude: parseFloat(gig.lng),
          latitude: parseFloat(gig.lat),
        };

        const attributes = {
          ...gig,
          date: new Date(gig.startdate).toISOString(),
        };

        const markerSymbol = {
          type: "point-3d",
          symbolLayers: [
            {
              type: "icon",
              resource: { primitive: "circle" },
              size: 12,
              material: { color: "orange" },
            },
          ],
        };

        const popupTemplate = {
          title: "{name}",
          content: `
              <strong>Venue:</strong> {venueName}<br/>
              <strong>Date:</strong> {startdate}<br/>
              <strong>Time:</strong> {starttime}<br/>
              <strong>Artists:</strong> {artists}<br/>
              <strong>Description:</strong><br/>{description}`,
        };

        const graphic = new Graphic({
          geometry: point,
          symbol: markerSymbol,
          attributes,
          popupTemplate,
        });

        graphicsLayer.add(graphic);
      });

      const timeSlider = new TimeSlider({
        container: sliderRef.current!,
        view,
        fullExtent: {
          start: new Date(),
          end: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 60),
        },
        mode: "time-window",
        values: [
          new Date(),
          new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 14),
        ],
      });

      console.log("SceneView created:", view);

      view.ui.add(timeSlider, "bottom-left");

      timeSlider.watch(
        "timeExtent",
        ({ start, end }: { start: Date; end: Date }) => {
          graphicsLayer.graphics.forEach((g: any) => {
            const gigDate = new Date(g.attributes.date);
            g.visible = gigDate >= start && gigDate <= end;
          });
        }
      );
    });
  }, [gigs]);

  return (
    <div className="w-[100vw] h-[100vh] relative bg-black">
      <div ref={mapRef} className="w-full h-full" />
      <div
        id="timeSlider"
        ref={sliderRef}
        className="absolute bottom-20 left-0 right-0 h-16 z-10 bg-white"
      />
    </div>
  );
};
