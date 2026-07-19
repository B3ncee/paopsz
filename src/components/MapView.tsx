import L, { LatLngExpression } from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

interface TeamMarker {
  id: string;
  name: string;
  number: string;
  position: [number, number];
}

interface MapViewProps {
  markers: TeamMarker[];
  onMarkerDragEnd?: (id: string, position: [number, number]) => void;
}

export function MapView({ markers, onMarkerDragEnd }: MapViewProps) {
  const center: LatLngExpression = markers.length > 0 ? markers[0].position : [47.4979, 19.0402];

  return (
    <MapContainer center={center} zoom={12} scrollWheelZoom style={{ height: '320px', width: '100%', borderRadius: '18px' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={marker.position}
          draggable={Boolean(onMarkerDragEnd)}
          eventHandlers={{
            dragend: (event) => {
              if (!onMarkerDragEnd) return;
              const latLng = event.target.getLatLng();
              onMarkerDragEnd(marker.id, [latLng.lat, latLng.lng]);
            },
          }}
        >
          <Popup>
            <strong>{marker.number}</strong> – {marker.name}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
