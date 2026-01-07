import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useStationStore } from '../store/useStationStore';
import L from 'leaflet';

// مختصات مرکز آلمان
const GERMANY_CENTER: [number, number] = [51.1657, 10.4515];
const INITIAL_ZOOM = 6;

function MapController({ center, zoom }: { center: [number, number], zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom, { animate: true });
    }, [center, zoom, map]);
    return null;
}

export default function MapPage() {
    const {
        filteredStations, fetchStations, setSearchQuery,
        setSelectedStation, selectedStation, loading, error
    } = useStationStore();

    const [inputValue, setInputValue] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => { fetchStations(); }, []);

    useEffect(() => {
        const timer = setTimeout(() => setSearchQuery(inputValue), 300);
        return () => clearTimeout(timer);
    }, [inputValue, setSearchQuery]);

    // تابع برگشت به نمای اولیه
    const resetView = () => {
        setSelectedStation(null);
        setInputValue('');
    };

    return (
        <div className="relative h-screen w-full bg-gray-100 overflow-hidden">

            {/* دکمه باز کردن سایدبار (وقتی بسته است) */}
            {!isSidebarOpen && (
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="absolute top-4 left-4 z-[1000] bg-white p-3 rounded-full shadow-2xl hover:bg-blue-50 transition-all border border-gray-200"
                >
                    🔍
                </button>
            )}

            {/* Sidebar معلق و متحرک */}
            <div className={`absolute top-4 left-4 bottom-4 z-[1000] w-80 md:w-96 bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl transition-all duration-300 ease-in-out flex flex-col border border-white/20 ${isSidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-[120%] opacity-0'
                }`}>

                {/* Header سایدبار */}
                <div className="p-5 border-b flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-black text-blue-800 tracking-tight">PANTO Rail</h1>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Germany Stations</p>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400"
                    >
                        ✕
                    </button>
                </div>

                {/* Input & Reset Button */}
                <div className="p-4 space-y-3">
                    <div className="relative">
                        <input
                            className="w-full p-3 pl-4 bg-gray-100/50 border-none rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition-all placeholder:text-gray-400 text-sm"
                            placeholder="Search city or station..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={resetView}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all shadow-md active:scale-95"
                    >
                        Reset Map View
                    </button>
                </div>

                {/* List Section */}
                <div className="flex-1 overflow-y-auto px-2 pb-4 custom-scrollbar">
                    {loading && <div className="text-center py-10 animate-pulse text-blue-500 font-medium">Loading Stations...</div>}
                    {error && <div className="text-red-500 bg-red-50 p-4 rounded-xl text-sm border border-red-100 m-2">{error}</div>}

                    {!loading && filteredStations.map(station => (
                        <div
                            key={station.id}
                            onClick={() => setSelectedStation(station)}
                            className={`group mb-1 p-4 rounded-xl cursor-pointer transition-all duration-200 ${selectedStation?.id === station.id
                                    ? 'bg-blue-600 text-white shadow-lg scale-[1.02]'
                                    : 'hover:bg-blue-50 text-gray-700 hover:pl-6'
                                }`}
                        >
                            <h3 className="font-bold text-sm leading-tight">{station.name}</h3>
                            <p className={`text-[10px] mt-1 font-semibold uppercase ${selectedStation?.id === station.id ? 'text-blue-200' : 'text-gray-400 group-hover:text-blue-400'
                                }`}>
                                📍 {station.city}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Map Section */}
            <MapContainer
                center={GERMANY_CENTER}
                zoom={INITIAL_ZOOM}
                className="h-full w-full z-0"
                zoomControl={false} // حذف دکمه‌های زوم پیش‌فرض برای زیبایی
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {/* مدیریت جابجایی نقشه */}
                <MapController
                    center={selectedStation ? [selectedStation.lat, selectedStation.lng] : GERMANY_CENTER}
                    zoom={selectedStation ? 13 : INITIAL_ZOOM}
                />

                {filteredStations.map(station => (
                    <Marker
                        key={station.id}
                        position={[station.lat, station.lng]}
                        eventHandlers={{ click: () => setSelectedStation(station) }}
                    >
                        <Popup className="custom-popup">
                            <div className="p-1 font-sans">
                                <p className="font-bold text-blue-800">{station.name}</p>
                                <p className="text-xs text-gray-500">{station.city}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}