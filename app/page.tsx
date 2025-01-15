// No "use client" here, so this is a Server Component by default
import styles from "./page.module.css";
import MapWrapper from "./MapWrapper";

export default function Home() {
  return (
    <div className={styles.homeWrapper}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <p>This is Sidebar...</p>
      </div>

      {/* Map Container */}
      <div style={{ height: "800px", width: "800px" }}>
        <MapWrapper />
      </div>
    </div>
  );
}