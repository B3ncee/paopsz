import React from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // <- FONTOS: Ez a sor javítja a térkép kinézetét!
import L from 'leaflet';

// Javítás a react-leaflet alapértelmezett ikon hibájára
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const createPatrolIcon = (name) => {
  return L.divIcon({
    className: 'patrol-marker',
    html: `<span>${name}</span>`,
    iconSize: [100, 40],
    iconAnchor: [50, 20],
  });
};

function MapView({ patrolLocations = {} }) {
  const position = [47.4979, 19.0402]; // Budapest koordinátái

  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{ flex: 1 }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {Object.values(patrolLocations).map(patrol => (
        patrol.location && (
          <Marker
            key={patrol.id}
            position={[patrol.location.lat, patrol.location.lng]}
            icon={createPatrolIcon(patrol.name)}
          >
            <Popup>
              {patrol.name}<br />
              {new Date(patrol.timestamp).toLocaleTimeString()}
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
}

MapView.propTypes = {
  patrolLocations: PropTypes.object,
};

export default MapView;