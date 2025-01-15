"use client";

import dynamic from "next/dynamic";

// We dynamically import the GoogleMap component with SSR disabled
// This is valid because MapWrapper is a Client Component
const GoogleMapComponent = dynamic(() => import("./components/GoogleMap"), {
  ssr: false,
});

export default function MapWrapper() {
  return <GoogleMapComponent />;
}