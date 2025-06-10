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
      mapTypeId: "satellite",
      styles: [
        {
          featureType: "all",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    }),
    []
  );

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries,
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<ImagePoint | null>(null);

  const NANJA_DAM = { lat: -3.3814908867140985, lng: 36.2832471881476 };

  function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

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
      {imagePoints.map((point) => {
        const distance = haversineDistance(point.lat, point.lng, NANJA_DAM.lat, NANJA_DAM.lng);
        return (
          <Marker
            key={point.id}
            position={{ lat: point.lat, lng: point.lng }}
            title={
              (point.title || `Image ${point.id}`) +
              `\nDistance to Nanja Dam: ${distance.toFixed(2)} km`
            }
            icon={{
              url: point.imageUrl,
              scaledSize: new google.maps.Size(40, 40), // Adjust size as needed
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(20, 20), // Center the image
            }}
            onClick={() => setSelectedPoint(point)}
          />
        );
      })}
      {selectedPoint && (
        <InfoWindow
          position={{ lat: selectedPoint.lat, lng: selectedPoint.lng }}
          onCloseClick={() => setSelectedPoint(null)}
        >
          <div style={{ maxWidth: 300 }}>
            <img src={selectedPoint.imageUrl} alt={selectedPoint.title || 'Full size'} style={{ width: '100%', height: 'auto', borderRadius: 8 }} />
            {selectedPoint.title && <div style={{ marginTop: 8, fontWeight: 'bold' }}>{selectedPoint.title}</div>}
            <div style={{ marginTop: 8 }}>
              Distance to Nanja Dam: {haversineDistance(selectedPoint.lat, selectedPoint.lng, NANJA_DAM.lat, NANJA_DAM.lng).toFixed(2)} km
            </div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default GoogleMapComponent;