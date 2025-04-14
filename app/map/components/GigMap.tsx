import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { styles } from "../styles";
import React, { useEffect } from "react";

const center = {
  lat: -31.9505,
  lng: 115.8605,
};

export const GigMap = () => {
  const [zoom, setZoom] = React.useState(12);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDTkZauLKxFmJ3qW2jKsgjLvgt30kqJ3AM",
  });

  const [map, setMap] = React.useState(null);

  useEffect(() => {
    setZoom(12);
  }, [map]);

  const onLoad = React.useCallback(function callback(map: any) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map: any) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={{
        margin: "auto",
        position: "absolute",
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
        top: 0,
        left: 0,
      }}
      center={center}
      zoom={zoom}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        styles: styles,
        disableDefaultUI: true,
        gestureHandling: "greedy",
      }}
    >
      {/* Child components, such as markers, info windows, etc. */}
      <></>
    </GoogleMap>
  ) : (
    <></>
  );
};
