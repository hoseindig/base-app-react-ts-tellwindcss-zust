import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

export default function MapController({ center, zoom, selectedStation, isSidebarOpen }: { center: [number, number]; zoom: number; selectedStation?: any; isSidebarOpen?: boolean; }) {
    const map = useMap();

    useEffect(() => {
        // Use flyTo for a smoother animated transition (falls back to setView if not available)
        if (typeof (map as any).flyTo === 'function') {
            (map as any).flyTo(center, zoom, { animate: true, duration: 0.8 });
        } else {
            map.setView(center, zoom, { animate: true });
        }
    }, [center, zoom, map]);

    useEffect(() => {
        // When sidebar is closed and there's a selected station, open a popup on the map at the station
        if (!isSidebarOpen && selectedStation) {
            // center/fly to selected station
            const stationPos: [number, number] = [selectedStation.lat, selectedStation.lng];
            if (typeof (map as any).flyTo === 'function') {
                (map as any).flyTo(stationPos, 13, { animate: true, duration: 0.8 });
            } else {
                map.setView(stationPos, 13, { animate: true });
            }

            const content = `<div class="p-1 font-sans"><p class="font-bold text-blue-800">${selectedStation.name}</p><p class="text-xs text-gray-500">${selectedStation.city}</p></div>`;
            L.popup({ closeButton: true, autoClose: true })
                .setLatLng(stationPos)
                .setContent(content)
                .openOn(map as any);
        } else {
            // close any existing popup when sidebar is open or no selection
            map.closePopup();
        }
    }, [isSidebarOpen, selectedStation, map]);

    return null;
}
