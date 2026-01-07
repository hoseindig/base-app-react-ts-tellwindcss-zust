import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center p-6">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">404 — Page Not Found</h1>
                <p className="text-slate-600 mb-6">The page you are looking for does not exist or has been moved.</p>
                <div className="flex gap-4 justify-center">
                    <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:opacity-90">Go Home</Link>
                    <Link to="/map" className="bg-slate-200 text-slate-800 px-4 py-2 rounded hover:bg-slate-300">Open Map</Link>
                </div>
            </div>
        </div>
    );
}
