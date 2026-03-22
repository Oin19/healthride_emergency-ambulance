import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const ambulanceIcon = new L.DivIcon({
  html: `<div style="background: hsl(0 84% 60%); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); font-size: 16px;">🚑</div>`,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const patientIcon = new L.DivIcon({
  html: `<div style="background: hsl(142 71% 45%); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); font-size: 16px;">📍</div>`,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

function AnimatedAmbulance({ from, to }: { from: [number, number]; to: [number, number] }) {
  const map = useMap();
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    const marker = L.marker(from, { icon: ambulanceIcon }).addTo(map);
    markerRef.current = marker;

    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.005;
      if (progress >= 1) progress = 0;
      const lat = from[0] + (to[0] - from[0]) * progress;
      const lng = from[1] + (to[1] - from[1]) * progress;
      marker.setLatLng([lat, lng]);
    }, 50);

    return () => {
      clearInterval(interval);
      map.removeLayer(marker);
    };
  }, [map, from, to]);

  return null;
}

interface LiveTrackingMapProps {
  patientCoords: { lat: number; lng: number };
  className?: string;
}

const LiveTrackingMap = ({ patientCoords, className = "" }: LiveTrackingMapProps) => {
  // Ambulance starts ~0.02 degrees away (roughly 2km)
  const ambStart: [number, number] = [
    patientCoords.lat + 0.018,
    patientCoords.lng - 0.015,
  ];
  const patientPos: [number, number] = [patientCoords.lat, patientCoords.lng];

  return (
    <div className={`rounded-xl overflow-hidden border border-border ${className}`}>
      <MapContainer
        center={patientPos}
        zoom={14}
        style={{ height: "260px", width: "100%" }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={patientPos} icon={patientIcon}>
          <Popup>Your Location</Popup>
        </Marker>
        <Polyline
          positions={[ambStart, patientPos]}
          pathOptions={{ color: "hsl(0, 84%, 60%)", weight: 3, dashArray: "10 6" }}
        />
        <AnimatedAmbulance from={ambStart} to={patientPos} />
      </MapContainer>
    </div>
  );
};

export default LiveTrackingMap;
