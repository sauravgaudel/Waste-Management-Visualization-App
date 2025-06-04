
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useWaste } from '../context/WasteContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const wasteIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #dc2626;">
      <path d="m3 6 3 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l3-12"/>
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
      <line x1="10" x2="14" y1="11" y2="11"/>
      <line x1="10" x2="14" y1="15" y2="15"/>
    </svg>
  `),
  iconSize: [25, 25],
  iconAnchor: [12, 12],
});

const truckIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #2563eb;">
      <path d="M14 18V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
      <path d="M15 18H9"/>
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
      <circle cx="17" cy="18" r="2"/>
      <circle cx="7" cy="18" r="2"/>
    </svg>
  `),
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

interface TruckMovementProps {
  entryId: string;
  targetCoords: { lat: number; lng: number };
}

const TruckMovement: React.FC<TruckMovementProps> = ({ entryId, targetCoords }) => {
  const { updateTruckLocation } = useWaste();

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate truck movement towards target
      const randomOffset = {
        lat: (Math.random() - 0.5) * 0.001,
        lng: (Math.random() - 0.5) * 0.001
      };
      
      updateTruckLocation(entryId, {
        lat: targetCoords.lat + randomOffset.lat,
        lng: targetCoords.lng + randomOffset.lng
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [entryId, targetCoords, updateTruckLocation]);

  return null;
};

const WasteMap = () => {
  const { wasteEntries } = useWaste();
  const [mapKey, setMapKey] = useState(0);

  // Center map on NYC for demo
  const centerPosition: [number, number] = [40.7128, -74.0060];

  useEffect(() => {
    // Force re-render of map when entries change
    setMapKey(prev => prev + 1);
  }, [wasteEntries]);

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden border">
      <MapContainer
        key={mapKey}
        center={centerPosition}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Waste pickup locations */}
        {wasteEntries.map((entry) => (
          <Marker
            key={`waste-${entry.id}`}
            position={[entry.coordinates.lat, entry.coordinates.lng]}
            icon={wasteIcon}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-sm">{entry.wasteType}</h3>
                <p className="text-xs text-gray-600">{entry.quantity} kg</p>
                <p className="text-xs text-gray-600">{entry.address}</p>
                <p className="text-xs">
                  Status: <span className={`font-medium ${
                    entry.status === 'pending' ? 'text-yellow-600' :
                    entry.status === 'assigned' ? 'text-blue-600' :
                    'text-green-600'
                  }`}>
                    {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                  </span>
                </p>
                {entry.assignedTruck && (
                  <p className="text-xs text-blue-600 mt-1">
                    Truck: {entry.assignedTruck.truckNumber}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Garbage trucks */}
        {wasteEntries
          .filter(entry => entry.assignedTruck)
          .map((entry) => (
            <React.Fragment key={`truck-${entry.id}`}>
              <Marker
                position={[
                  entry.assignedTruck!.currentLocation.lat,
                  entry.assignedTruck!.currentLocation.lng
                ]}
                icon={truckIcon}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold text-sm">
                      Truck {entry.assignedTruck!.truckNumber}
                    </h3>
                    <p className="text-xs text-gray-600">
                      Driver: {entry.assignedTruck!.driverName}
                    </p>
                    <p className="text-xs text-gray-600">
                      Target: {entry.wasteType} pickup
                    </p>
                    <p className="text-xs text-blue-600">
                      En route to: {entry.address}
                    </p>
                  </div>
                </Popup>
              </Marker>
              <TruckMovement
                entryId={entry.id}
                targetCoords={entry.coordinates}
              />
            </React.Fragment>
          ))}
      </MapContainer>
    </div>
  );
};

export default WasteMap;
