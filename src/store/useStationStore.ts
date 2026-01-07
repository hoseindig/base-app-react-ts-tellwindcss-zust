import { create } from 'zustand';

interface Station {
    id: number;
    name: string;
    city: string;
    lat: number;
    lng: number;
}

interface StationState {
    stations: Station[];
    filteredStations: Station[];
    loading: boolean;
    searchQuery: string;
    selectedStation: Station | null;
    fetchStations: () => Promise<void>;
    setSearchQuery: (query: string) => void;
    setSelectedStation: (station: Station | null) => void;
}

export const useStationStore = create<StationState>((set, get) => ({
    stations: [],
    filteredStations: [],
    loading: false,
    searchQuery: '',
    selectedStation: null,

    fetchStations: async () => {
        set({ loading: true });
        try {
            const response = await fetch('/mock/train-stations.json');
            const data = await response.json();

            set({ stations: data, filteredStations: data, loading: false });
        } catch (error) {
            console.error("Error fetching data:", error);
            set({ loading: false });
        }
    },

    setSearchQuery: (query: string) => {
        const { stations } = get();
        const filtered = stations.filter(s =>
            s.city.toLowerCase().includes(query.toLowerCase())
        );
        set({ searchQuery: query, filteredStations: filtered });
    },

    setSelectedStation: (station) => set({ selectedStation: station }),
}));