"use client";

import dynamic from "next/dynamic";

interface ImagePoint {
  id: string;
  lat: number;
  lng: number;
  imageUrl: string;
  title?: string;
}

interface MapWrapperProps {
  imagePoints: ImagePoint[];
}

const MapWrapper = ({ imagePoints }: MapWrapperProps) => {
  const GoogleMapComponent = dynamic(
    () => import("./components/GoogleMap"),
    {
      loading: () => <p>Loading map...</p>,
      ssr: false,
    }
  );

  return <GoogleMapComponent imagePoints={imagePoints} />;
};

export default MapWrapper;