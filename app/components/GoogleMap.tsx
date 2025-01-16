"use client";

import { useMemo } from "react";
import { useLoadScript, GoogleMap, Libraries } from "@react-google-maps/api";

const GoogleMapComponent = () => {
  // Explicitly type the libraries as `Libraries`
  const libraries: Libraries = ["places"];

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
    libraries, // use the typed `libraries`
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
      {/* Add markers or other children here */}
    </GoogleMap>
  );
};

export default GoogleMapComponent;