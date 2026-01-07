import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import NotFound from './NotFound';

describe('NotFound route', () => {
    it('renders 404 for unknown route', () => {
        render(
            <MemoryRouter initialEntries={["/this-route-does-not-exist"]}>
                <Routes>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText(/404/i)).toBeInTheDocument();
        expect(screen.getByText(/Go Home/i)).toBeInTheDocument();
    });
});
