import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

export default function MapController({ center, zoom }: { center: [number, number]; zoom: number; }) {
    const map = useMap();

    useEffect(() => {
        // Use flyTo for a smoother animated transition (falls back to setView if not available)
        if (typeof (map as any).flyTo === 'function') {
            (map as any).flyTo(center, zoom, { animate: true, duration: 0.8 });
        } else {
            map.setView(center, zoom, { animate: true });
        }
    }, [center, zoom, map]);

    return null;
}
