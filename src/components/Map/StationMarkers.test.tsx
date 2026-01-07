import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const markersProps: any[] = [];

vi.mock('react-leaflet', () => ({
    Marker: (props: any) => {
        markersProps.push(props);
        // render children so popups are visible to tests
        return <div data-testid="marker">{props.children}</div>;
    },
    Popup: ({ children }: any) => <div>{children}</div>
}));

import StationMarkers from './StationMarkers';

const stations = [
    { id: 1, name: 'Station 1', city: 'City A', lat: 10, lng: 20 },
    { id: 2, name: 'Station 2', city: 'City B', lat: 11, lng: 21 }
];

describe('StationMarkers', () => {
    beforeEach(() => {
        markersProps.length = 0;
    });

    it('renders a marker for each station and click handlers call onSelect', () => {
        const onSelect = vi.fn();
        render(<StationMarkers stations={stations as any} onSelect={onSelect} selectedStation={null} />);

        expect(markersProps.length).toBe(stations.length);

        // simulate click handler call
        markersProps[0].eventHandlers.click();
        expect(onSelect).toHaveBeenCalledWith(stations[0]);
    });
});