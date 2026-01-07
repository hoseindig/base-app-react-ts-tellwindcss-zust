import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

export default function MapController({ center, zoom }: { center: [number, number]; zoom: number; }) {
    const map = useMap();

    useEffect(() => {
        map.setView(center, zoom, { animate: true });
    }, [center, zoom, map]);

    return null;
}
