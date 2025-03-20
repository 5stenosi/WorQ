'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Dynamically import Leaflet to avoid SSR issues
const MapComponent: React.FC = () => {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const L = require('leaflet'); // Dynamically require Leaflet

            // Initialize the map
            const map = L.map('map').setView([45.4642, 9.19], 13); // Coordinates of Milan, zoom 13

            // Add the OpenStreetMap layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
            }).addTo(map);

            // Define a custom red marker icon
            const redIcon = L.icon({
                iconUrl: '/markers/red-marker.png', // Replace with the actual path to your red marker image
                iconSize: [50, 50], // Size of the icon
                iconAnchor: [25, 50], // Point of the icon which will correspond to marker's location
                popupAnchor: [0, -25], // Point from which the popup should open relative to the iconAnchor
            });

            // Add the custom marker to the map
            L.marker([45.4642, 9.19], { icon: redIcon })
                .addTo(map)
                .bindPopup('Milano, Italia')
                .openPopup();

            // Clean up the map when the component is unmounted
            return () => {
                map.remove();
            };
        }
    }, []);

    return (
        <div className="flex w-full h-full">
            {/* Map Section */}
            <div id="map" className="w-3/4 h-full rounded-2xl shadow-sm"></div>

            {/* Card Section */}
            <div className="w-1/4 h-full p-4 ml-4 bg-white rounded-2xl shadow-sm">
                <h2 className="text-xl font-bold mb-4">Seleziona un marker...</h2>
                <p>...verranno mostrate le informazioni dello spazio di coworking selezionato.</p>
            </div>
        </div>
    );
};

export default dynamic(() => Promise.resolve(MapComponent), { ssr: false });