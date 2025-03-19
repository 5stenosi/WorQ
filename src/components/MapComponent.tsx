'use client';

import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent: React.FC = () => {
    useEffect(() => {
        // Inizializza la mappa
        const map = L.map('map').setView([45.4642, 9.19], 13); // Coordinate di Milano, zoom 13

        // Aggiungi il layer di OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
        }).addTo(map);

        L.marker([45.4642, 9.19])
            .addTo(map)
            .bindPopup('Milano, Italia')
            .openPopup();

        // Pulisci la mappa quando il componente viene smontato
        return () => {
            map.remove();
        };
    }, []);

    return <div id="map" className="w-full h-full rounded-2xl shadow-lg"></div>;
};

export default MapComponent;