"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import MapWrapper from "./MapWrapper";

interface ImagePoint {
  id: string;
  lat: number;
  lng: number;
  imageUrl: string;
  title?: string;
}

export default function Home() {
  const [imagePoints, setImagePoints] = useState<ImagePoint[]>([]);

  useEffect(() => {
    const loadImages = async () => {
      try {
        // Fetch the list of images from the photos directory
        const response = await fetch('/api/photos');
        const images = await response.json();
        
        const points: ImagePoint[] = images.map((filename: string) => {
          // Remove only the last extension (handles filenames with multiple periods)
          const name = filename.replace(/\.[^/.]+$/, "");
          const [lat, lng, ...titleParts] = name.split(',');
          
          return {
            id: filename,
            lat: parseFloat(lat),
            lng: parseFloat(lng),
            imageUrl: `/photos/${filename}`,
            title: titleParts.join(',') || undefined
          };
        });

        setImagePoints(points);
      } catch (error) {
        console.error('Error loading images:', error);
      }
    };

    loadImages();
  }, []);

  return (
    <div className={styles.fullMapWrapper}>
      <MapWrapper imagePoints={imagePoints} />
    </div>
  );
}