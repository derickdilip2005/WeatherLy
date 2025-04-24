'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
// Remove useEffect if not used
import { Coordinates } from '@/types/weather';

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as { _getIconUrl?: string })._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

export default function WeatherMap({ coordinates }: { coordinates: Coordinates }) {
  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden">
      {coordinates.lat !== 0 && coordinates.lon !== 0 && (
        <MapContainer 
          center={[coordinates.lat, coordinates.lon]} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
          key={`${coordinates.lat}-${coordinates.lon}`}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[coordinates.lat, coordinates.lon]}>
            <Popup>
              Selected Location
            </Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
}