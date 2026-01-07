import { describe, it, expect, beforeEach } from 'vitest';
import { useStationStore } from './useStationStore';

describe('Station Store', () => {
    beforeEach(() => {
        const { stations } = useStationStore.getState();
    });

    it('should filter stations by city correctly', () => {
        const store = useStationStore.getState();

        useStationStore.setState({
            stations: [
                { id: 1, name: 'Hbf', city: 'Berlin', lat: 52, lng: 13 },
                { id: 2, name: 'Hbf', city: 'Hamburg', lat: 53, lng: 10 }
            ]
        });

        store.setSearchQuery('Berlin');

        const filtered = useStationStore.getState().filteredStations;
        expect(filtered.length).toBe(1);
        expect(filtered[0].city).toBe('Berlin');
    });
});