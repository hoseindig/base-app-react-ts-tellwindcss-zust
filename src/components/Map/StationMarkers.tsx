import { Marker, Popup } from 'react-leaflet';
import type { Station } from '../../store/useStationStore';

interface Props {
    stations: Station[];
    onSelect: (station: Station) => void;
    selectedStation: Station | null;
}

export default function StationMarkers({ stations, onSelect, selectedStation }: Props) {
    return (
        <>
            {stations.map(station => (
                <Marker
                    key={station.id}
                    position={[station.lat, station.lng]}
                    eventHandlers={{ click: () => onSelect(station) }}
                >
                    <Popup className="custom-popup">
                        <div className="p-1 font-sans">
                            <p className="font-bold text-blue-800">{station.name}</p>
                            <p className="text-xs text-gray-500">{station.city}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </>
    );
}
