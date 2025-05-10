'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const MapComponent: React.FC = () => {
    const [zoom, setZoom] = useState(13);

    useEffect(() => {
        const updateZoom = () => {
            const width = window.innerWidth;
            if (width < 640) {
                setZoom(15); // Mobile
            } else if (width < 768) {
                setZoom(14); // Small screens
            } else if (width < 1024) {
                setZoom(13); // Medium screens
            } else {
                setZoom(12); // Large screens
            }
        };

        updateZoom(); // Set initial zoom
        window.addEventListener('resize', updateZoom);

        return () => {
            window.removeEventListener('resize', updateZoom);
        };
    }, []);

    useEffect(() => {
        let map: L.Map | null = null; // Declare map variable

        if (typeof window !== 'undefined') {
            import('leaflet').then((L) => {
                // Fix for marker icons not appearing
                L.Icon.Default.mergeOptions({
                    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
                    iconUrl: require('leaflet/dist/images/marker-icon.png'),
                    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
                });

                // Check if map already exists and remove it
                const mapContainer = document.getElementById('map');
                if (mapContainer && (mapContainer as any)._leaflet_id) {
                    return; // Prevent re-initialization
                }

                // Initialize the map
                map = L.map('map', {
                    zoomControl: true, // Enable zoom controls by default
                    dragging: false, // Disable dragging initially
                    scrollWheelZoom: false, // Disable scroll wheel zoom initially
                }).setView([43.1381, 13.0684], zoom);

                // Add the Stadia.AlidadeSmoothDark layer
                L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
                    minZoom: 0,
                    maxZoom: 20,
                    attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                }).addTo(map);

                // Add the default marker to the map
                L.marker([43.1381, 13.0684])
                    .addTo(map)
                    .bindPopup('Camerino, MC')
                    .openPopup();

                // Enable controls on map click
                const enableControls = () => {
                    map?.scrollWheelZoom.enable();
                    map?.dragging.enable();
                };

                // Reset controls when map loses focus
                const resetControls = () => {
                    map?.scrollWheelZoom.disable();
                    map?.dragging.disable();
                };

                const handleClickOutside = (event: MouseEvent) => {
                    if (!(event.target as HTMLElement).closest('#map')) {
                        resetControls();
                        document.removeEventListener('click', handleClickOutside);
                    }
                };

                map.on('click', () => {
                    enableControls();
                    document.addEventListener('click', handleClickOutside);
                });
            });
        }

        // Clean up the map when the component is unmounted
        return () => {
            if (map) {
                map.remove();
                map = null;
            }
        };
    }, []);

    return (
        <div className="flex w-full h-full">
            <div id="map" className="w-full h-full rounded-2xl shadow-sm"></div>
        </div>
    );
};

export default dynamic(() => Promise.resolve(MapComponent), { ssr: false });