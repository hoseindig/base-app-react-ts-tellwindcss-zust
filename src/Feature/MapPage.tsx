import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useStationStore } from '../store/useStationStore';

function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        if (center) map.setView(center, 13);
    }, [center, map]);
    return null;
}

export default function MapPage() {
    const {
        filteredStations,
        fetchStations,
        setSearchQuery,
        setSelectedStation,
        selectedStation,
        loading,
        error
    } = useStationStore();

    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        fetchStations();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(inputValue);
        }, 300);
        return () => clearTimeout(timer);
    }, [inputValue, setSearchQuery]);

    return (
        <div className="flex h-screen w-full bg-gray-50">
            {/* Sidebar */}
            <div className="w-1/3 p-4 flex flex-col border-r bg-white shadow-lg z-10">
                <h1 className="text-xl font-bold mb-4 text-blue-700">Germany Rail Stations</h1>

                <input
                    className="p-2 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                    placeholder="Search by city or station..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />

                {/* Handling Loading & Error */}
                {loading && <div className="text-center py-10">⌛ Loading stations...</div>}
                {error && <div className="text-red-500 bg-red-100 p-3 rounded-md">{error}</div>}

                <div className="overflow-y-auto flex-1">
                    {!loading && filteredStations.length === 0 && (
                        <p className="text-gray-500 text-center mt-4">No stations found.</p>
                    )}
                    {filteredStations.map(station => (
                        <div
                            key={station.id}
                            onClick={() => setSelectedStation(station)}
                            className={`p-3 border-b cursor-pointer transition-colors ${selectedStation?.id === station.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-gray-100'
                                }`}
                        >
                            <h3 className="font-bold text-gray-800">{station.name}</h3>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">{station.city}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Map Section */}
            <div className="w-2/3 h-full relative">
                <MapContainer center={[51.1657, 10.4515]} zoom={6} className="h-full w-full">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {selectedStation && <ChangeView center={[selectedStation.lat, selectedStation.lng]} />}

                    {filteredStations.map(station => (
                        <Marker
                            key={station.id}
                            position={[station.lat, station.lng]}
                            eventHandlers={{
                                click: () => setSelectedStation(station),
                            }}
                        >
                            <Popup>
                                <div className="text-center">
                                    <p className="font-bold">{station.name}</p>
                                    <p className="text-sm">{station.city}</p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
}