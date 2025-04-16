'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const MapComponent: React.FC = () => {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const L = require('leaflet');

            // Fix for marker icons not appearing
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
                iconUrl: require('leaflet/dist/images/marker-icon.png'),
                shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
            });

            // Initialize the map
            const map = L.map('map').setView([45.4642, 9.19], 13);

            // Add the Stadia.AlidadeSmoothDark layer
            L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
                minZoom: 0,
                maxZoom: 20,
                attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                ext: 'png',
            }).addTo(map);

            // Add the default marker to the map
            L.marker([45.4642, 9.19])
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
            <div id="map" className="w-3/4 h-full rounded-2xl shadow-sm"></div>
            <div className="w-1/4 h-full p-4 ml-4 bg-stone-100 rounded-2xl shadow-sm">
                <h2 className="text-xl font-bold mb-4">Seleziona un marker...</h2>
                <p>...verranno mostrate le informazioni dello spazio di coworking selezionato.</p>
            </div>
        </div>
    );
};

export default dynamic(() => Promise.resolve(MapComponent), { ssr: false });