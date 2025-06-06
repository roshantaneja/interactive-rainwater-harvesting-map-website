"use client";

import { useState } from "react";
import styles from "./page.module.css";
import MapWrapper from "./MapWrapper";

export default function Home() {
  const [csvData, setCsvData] = useState<any[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const rows = text.split('\n').map(row => row.split(','));
        const headers = rows[0];
        const data = rows.slice(1).map(row => {
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header.trim()] = row[index]?.trim();
          });
          return obj;
        });
        setCsvData(data);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className={styles.homeWrapper}>
      <div className={styles.sidebar}>
        <div className={styles.fileUpload}>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            id="csvFile"
          />
          <label htmlFor="csvFile">
            Click to upload CSV file
          </label>
        </div>
        <div>
          <h3>Uploaded Points: {csvData.length}</h3>
          {csvData.length > 0 && (
            <pre style={{ fontSize: '12px', overflow: 'auto' }}>
              {JSON.stringify(csvData.slice(0, 3), null, 2)}
              {csvData.length > 3 ? '\n...' : ''}
            </pre>
          )}
        </div>
      </div>
      <div className={styles.mapContainer}>
        <MapWrapper csvData={csvData} />
      </div>
    </div>
  );
}