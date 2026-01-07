import { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { useStationStore } from '../store/useStationStore';
import useDebounce from '../hooks/useDebounce';

import MapController from '../components/Map/MapController';
import StationMarkers from '../components/Map/StationMarkers';
import Sidebar from '../components/Sidebar/Sidebar';

// مختصات مرکز آلمان
const GERMANY_CENTER: [number, number] = [51.1657, 10.4515];
const INITIAL_ZOOM = 6;

export default function MapPage() {
    const {
        filteredStations, fetchStations, setSearchQuery,
        setSelectedStation, selectedStation, loading, error
    } = useStationStore();

    const [inputValue, setInputValue] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const debounced = useDebounce(inputValue, 300);

    useEffect(() => { fetchStations(); }, [fetchStations]);

    useEffect(() => {
        setSearchQuery(debounced);
    }, [debounced, setSearchQuery]);

    const resetView = () => {
        setSelectedStation(null);
        setInputValue('');
    };

    return (
        <div className="relative w-full bg-gray-100 overflow-hidden" style={{ height: 'calc(100vh - 4rem)' }}>

            {!isSidebarOpen && (
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="absolute top-4 left-4 z-1000 bg-white p-3 rounded-full shadow-2xl hover:bg-blue-50 transition-all border border-gray-200"
                >
                    🔍
                </button>
            )}

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                inputValue={inputValue}
                onChangeInput={setInputValue}
                onReset={resetView}
                stations={filteredStations}
                selectedStation={selectedStation}
                onSelect={setSelectedStation}
                loading={loading}
                error={error}
            />

            <MapContainer
                center={GERMANY_CENTER}
                zoom={INITIAL_ZOOM}
                className="h-full w-full z-0"
                zoomControl={false} // حذف دکمه‌های زوم پیش‌فرض برای زیبایی
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <MapController
                    center={selectedStation ? [selectedStation.lat, selectedStation.lng] : GERMANY_CENTER}
                    zoom={selectedStation ? 13 : INITIAL_ZOOM}
                    selectedStation={selectedStation}
                    isSidebarOpen={isSidebarOpen}
                />

                <StationMarkers
                    stations={filteredStations}
                    onSelect={setSelectedStation}
                    selectedStation={selectedStation}
                />
            </MapContainer>
        </div>
    );
}