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
    <div className={styles.homeWrapper}>
      <div className={styles.sidebar}>
        <div className={styles.infoBox}>
          <h3>Image Points: {imagePoints.length}</h3>
          <p className={styles.uploadHint}>
            Images are loaded from the /public/photos directory
            <br />
            Name format: longitude,latitude,title.jpg
            <br />
            Example: -3.30,36.24,33.jpg
          </p>
        </div>
        <div>
          {imagePoints.length > 0 && (
            <div className={styles.imageList}>
              {imagePoints.map((point) => (
                <div key={point.id} className={styles.imageItem}>
                  <img src={point.imageUrl} alt={point.title || 'Map point'} width={50} height={50} />
                  <div>
                    <p>Lat: {point.lat}</p>
                    <p>Lng: {point.lng}</p>
                    {point.title && <p>Title: {point.title}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className={styles.mapContainer}>
        <MapWrapper imagePoints={imagePoints} />
      </div>
    </div>
  );
}