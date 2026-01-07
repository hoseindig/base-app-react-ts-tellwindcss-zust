import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const position: [number, number] = [35.6892, 51.3890]; // Tehran

export default function MapView() {
    return (
        <MapContainer
            center={position}
            zoom={13}
            style={{ height: '400px', width: '100%' }}
        >
            <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={position}>
                <Popup>
                    Tehran 📍
                </Popup>
            </Marker>
        </MapContainer>
    );
}
