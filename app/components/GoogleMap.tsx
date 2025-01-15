"use client";

import { useMemo } from "react";
import { useLoadScript, GoogleMap } from "@react-google-maps/api";

const GoogleMapComponent = () => {
  const libraries = useMemo(() => ["places"], []);
  const mapCenter = useMemo(() => ({ lat: 65.66, lng: -3.35 }), []);
  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: false,
    }),
    []
  );

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries,
  });

  if (loadError) {
    console.error("Error loading Google Maps:", loadError);
    return <p>Error loading map</p>;
  }

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <GoogleMap
      options={mapOptions}
      center={mapCenter}
      zoom={14}
      mapContainerStyle={{ width: "100%", height: "100%" }}
      onLoad={(map) => console.log("Map loaded:", map)}
    >
      {/* Add children components like markers here */}
    </GoogleMap>
  );
};

export default GoogleMapComponent;