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
    error: string | null; //  
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
    error: null,
    searchQuery: '',
    selectedStation: null,

    fetchStations: async () => {
        set({ loading: true, error: null });
        try {
            const response = await fetch('/mock/train-stations.json');
            if (!response.ok) throw new Error('Failed to fetch data');
            const data = await response.json();
            setTimeout(() => { set({ stations: data, filteredStations: data, loading: false }); }, 500);

        } catch (err: any) {
            set({ error: err.message, loading: false });
        }
    },

    setSearchQuery: (query: string) => {
        set({ searchQuery: query });
        const { stations } = get();
        const filtered = stations.filter(s =>
            s.city.toLowerCase().includes(query.toLowerCase()) ||
            s.name.toLowerCase().includes(query.toLowerCase())
        );
        set({ filteredStations: filtered });
    },

    setSelectedStation: (station) => set({ selectedStation: station }),
}));