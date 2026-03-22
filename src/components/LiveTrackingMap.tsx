interface LiveTrackingMapProps {
  patientCoords: { lat: number; lng: number };
  className?: string;
}

const LiveTrackingMap = ({ patientCoords, className = "" }: LiveTrackingMapProps) => {
  const { lat, lng } = patientCoords;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.02}%2C${lat - 0.015}%2C${lng + 0.02}%2C${lat + 0.015}&layer=mapnik&marker=${lat}%2C${lng}`;

  return (
    <div className={`rounded-xl overflow-hidden border border-border ${className}`}>
      <iframe
        title="Live Tracking Map"
        src={src}
        style={{ width: "100%", height: "260px", border: 0 }}
        allowFullScreen
        loading="lazy"
      />
      <div className="flex items-center gap-2 px-3 py-2 bg-card text-xs text-muted-foreground">
        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        Live tracking active — Ambulance en route
      </div>
    </div>
  );
};

export default LiveTrackingMap;
