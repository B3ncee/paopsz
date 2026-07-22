import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapView.css';

// Alapértelmezett (járőr) ikon
const patrolIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Diszpécser ikon (más színnel)
const dispatcherIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapView({ patrolLocations, patrolUnits, center }) {
  // Készítünk egy gyorsan kereshető térképet a patrolUnit-okból userId alapján
  const unitsByUserId = useMemo(() => {
    return patrolUnits.reduce((acc, unit) => {
      if (unit.userId) {
        acc[unit.userId] = unit;
      }
      return acc;
    }, {});
  }, [patrolUnits]);

  return (
    <MapContainer center={center || [47.4979, 19.0402]} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {Object.entries(patrolLocations).map(([userId, data]) => {
        if (!data.location) return null;

        const unit = unitsByUserId[userId];
        const icon = unit && unit.type === 'dispatcher' ? dispatcherIcon : patrolIcon;

        return (
          <Marker key={userId} position={[data.location.lat, data.location.lng]} icon={icon}>
            <Popup>
              {data.name}<br />
              Frissítve: {new Date(data.timestamp).toLocaleTimeString()}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default MapView;