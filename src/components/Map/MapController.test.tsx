import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

let mockMap: any = { flyTo: vi.fn(), setView: vi.fn(), closePopup: vi.fn() };

vi.mock('react-leaflet', () => ({
    useMap: () => mockMap,
}));

vi.mock('leaflet', () => ({
    popup: () => ({ setLatLng: vi.fn().mockReturnThis(), setContent: vi.fn().mockReturnThis(), openOn: vi.fn().mockReturnThis() })
}));

import MapController from './MapController';

describe('MapController', () => {
    beforeEach(() => {
        mockMap = { flyTo: vi.fn(), setView: vi.fn(), closePopup: vi.fn() };
    });

    it('uses flyTo when available', () => {
        mockMap = { flyTo: vi.fn(), setView: vi.fn(), closePopup: vi.fn() };
        render(<MapController center={[10, 20]} zoom={8} />);

        expect(mockMap.flyTo).toHaveBeenCalled();
        expect(mockMap.flyTo).toHaveBeenCalledWith([10, 20], 8, expect.objectContaining({ animate: true, duration: 0.8 }));
    });

    it('falls back to setView when flyTo is not available', () => {
        mockMap = { setView: vi.fn(), closePopup: vi.fn() };
        render(<MapController center={[1, 2]} zoom={5} />);

        expect(mockMap.setView).toHaveBeenCalled();
        expect(mockMap.setView).toHaveBeenCalledWith([1, 2], 5, expect.objectContaining({ animate: true }));
    });

    it('opens a popup when sidebar is closed and selectedStation exists', () => {
        mockMap = { flyTo: vi.fn(), setView: vi.fn(), closePopup: vi.fn() };
        const selected = { id: 1, name: 'Test', city: 'City', lat: 12, lng: 34 };

        const { popup } = require('leaflet');
        const spyPopup = popup();

        render(<MapController center={[0, 0]} zoom={6} selectedStation={selected} isSidebarOpen={false} />);

        // popup.openOn should be called with map
        expect(spyPopup.openOn).toHaveBeenCalled();
    });
});