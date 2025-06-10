"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { useLoadScript, GoogleMap, Libraries, Marker, InfoWindow } from "@react-google-maps/api";

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
      disableDefaultUI: false,
      clickableIcons: true,
      scrollwheel: true,
      zoomControl: true,
    }),
    []
  );

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries,
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<ImagePoint | null>(null);

  useEffect(() => {
    if (mapRef.current && imagePoints.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      imagePoints.forEach((point) => {
        bounds.extend({ lat: point.lat, lng: point.lng });
      });
      mapRef.current.fitBounds(bounds);
    }
  }, [imagePoints]);

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
      onLoad={(map) => {
        mapRef.current = map;
        if (imagePoints.length > 0) {
          const bounds = new window.google.maps.LatLngBounds();
          imagePoints.forEach((point) => {
            bounds.extend({ lat: point.lat, lng: point.lng });
          });
          map.fitBounds(bounds);
        }
      }}
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
          onClick={() => setSelectedPoint(point)}
        />
      ))}
      {selectedPoint && (
        <InfoWindow
          position={{ lat: selectedPoint.lat, lng: selectedPoint.lng }}
          onCloseClick={() => setSelectedPoint(null)}
        >
          <div style={{ maxWidth: 300 }}>
            <img src={selectedPoint.imageUrl} alt={selectedPoint.title || 'Full size'} style={{ width: '100%', height: 'auto', borderRadius: 8 }} />
            {selectedPoint.title && <div style={{ marginTop: 8, fontWeight: 'bold' }}>{selectedPoint.title}</div>}
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default GoogleMapComponent;