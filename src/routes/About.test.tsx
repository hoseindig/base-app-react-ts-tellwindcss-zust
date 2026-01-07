import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import About from './About';

describe('About page', () => {
    it('renders contact info and skills', () => {
        render(<About />);

        expect(screen.getByText(/hossein.sheykhi.developer@gmail.com/i)).toBeInTheDocument();
        expect(screen.getByText(/09125771225/)).toBeInTheDocument();
        expect(screen.getByText(/Skills & Technologies/)).toBeInTheDocument();
    });
});