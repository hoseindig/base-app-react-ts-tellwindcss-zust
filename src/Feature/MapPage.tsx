import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useStationStore } from '../store/useStationStore';

// برای جابجایی نقشه وقتی روی لیست کلیک می‌شود
function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    map.setView(center, 13);
    return null;
}

export default function MapPage() {
    const { filteredStations, fetchStations, searchQuery, setSearchQuery, setSelectedStation, selectedStation } = useStationStore();

    useEffect(() => {
        fetchStations();
    }, []);

    return (
        <div className="flex h-screen w-full">
            {/* Sidebar: List & Search */}
            <div className="w-1/3 p-4 flex flex-col border-r">
                <input
                    className="p-2 border rounded mb-4"
                    placeholder="Filter by city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="overflow-y-auto">
                    {filteredStations.map(station => (
                        <div
                            key={station.id}
                            onClick={() => setSelectedStation(station)}
                            className="p-3 border-b cursor-pointer hover:bg-gray-100"
                        >
                            <h3 className="font-bold">{station.name}</h3>
                            <p className="text-sm text-gray-600">{station.city}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Map Section */}
            <div className="w-2/3 h-full">
                <MapContainer center={[51.1657, 10.4515]} zoom={6} className="h-full w-full">
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    {selectedStation && <ChangeView center={[selectedStation.lat, selectedStation.lng]} />}

                    {filteredStations.map(station => (
                        <Marker key={station.id} position={[station.lat, station.lng]}>
                            <Popup>{station.name}</Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
}

