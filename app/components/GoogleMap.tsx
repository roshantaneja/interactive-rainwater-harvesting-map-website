"use client";

import { useMemo } from "react";
import { useLoadScript, GoogleMap, Libraries, Marker } from "@react-google-maps/api";

interface ImagePoint {
  id: string;
  lat: number;
  lng: number;
  imageUrl: string;
  title?: string;
}

interface GoogleMapComponentProps {
  imagePoints: ImagePoint[];
}

const GoogleMapComponent = ({ imagePoints }: GoogleMapComponentProps) => {
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
      {imagePoints.map((point) => (
        <Marker
          key={point.id}
          position={{ lat: point.lat, lng: point.lng }}
          title={point.title || `Image ${point.id}`}
          icon={{
            url: point.imageUrl,
            scaledSize: new google.maps.Size(40, 40), // Adjust size as needed
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(20, 20), // Center the image
          }}
        />
      ))}
    </GoogleMap>
  );
};

export default GoogleMapComponent;