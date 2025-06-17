'use client';

import React, { useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons/faArrowUpRightFromSquare';

// MapComponent displays a Leaflet map with markers for spaces fetched from the API
const MapComponent: React.FC = () => {
    useEffect(() => {
        let map: any = null; // Reference to the Leaflet map instance

        const initializeMap = async () => {
            if (typeof window !== 'undefined') {
                const L = (await import('leaflet')).default;

                // Custom icon for map markers
                const customIcon = L.Icon.extend({
                    options: {
                        iconUrl: "/location-dot-solid-turquoise-blue-50.svg",
                        iconSize: [32, 32],
                        iconAnchor: [16, 32],
                        popupAnchor: [0, -32],
                    },
                });

                // Prevent re-initialization if map already exists
                const mapContainer = document.getElementById('map');
                if (mapContainer && (mapContainer as any)._leaflet_id) {
                    return;
                }

                // Initialize the map centered on Italy
                map = L.map('map', {
                    zoomControl: true,
                    dragging: false,
                    scrollWheelZoom: false,
                }).setView([43.1381, 13.0684], 6);

                // Add dark tile layer
                L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
                    minZoom: 3,
                    maxZoom: 17,
                    attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                }).addTo(map);

                // Fetch spaces and add markers to the map
                const fetchSpaces = async () => {
                    try {
                        const response = await fetch('/api/map');
                        const spaces = await response.json();

                        spaces.forEach((space: any) => {
                            const { latitude, longitude } = space.address;
                            if (latitude && longitude) {
                                // Popup content for each marker
                                const popupContent = `
                                    <div class="flex gap-3">
                                        <a id="space-link" href="/spaces/${space.id}" target="_blank" class="flex justify-center items-center aspect-square size-12 bg-stone-100 hover:bg-stone-900 shadow-sm border-1 border-stone-900/10 rounded-md transition">
                                            ${ReactDOMServer.renderToString(<FontAwesomeIcon icon={faArrowUpRightFromSquare} />)}
                                        </a>
                                        <div class="flex flex-col">
                                            <h2 class="font-bold text-lg m-0">${space.name}</h2>
                                            <p style="margin: 0" class="text-stone-600">
                                                ${space.address?.number != null ? `${space.address?.street} ${space.address.number}` : `${space.address?.street}`}, ${space.address?.city}
                                            </p>
                                        </div>
                                    </div>
                                `;
                                L.marker([latitude, longitude], { icon: new customIcon() })
                                    .addTo(map)
                                    .bindPopup(popupContent);
                            }
                        });
                    } catch (error) {
                        console.error('Failed to fetch spaces:', error);
                    }
                };

                fetchSpaces();

                // Enable map controls (drag/zoom) on map click
                const enableControls = () => {
                    map?.scrollWheelZoom.enable();
                    map?.dragging.enable();
                };

                // Disable map controls when clicking outside
                const resetControls = () => {
                    map?.scrollWheelZoom.disable();
                    map?.dragging.disable();
                };

                // Listen for clicks outside the map to reset controls
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
            }
        };

        initializeMap();

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
            {/* Map container for Leaflet */}
            <div id="map" className="w-full h-full rounded-2xl shadow-sm"></div>
        </div>
    );
};

export default dynamic(() => Promise.resolve(MapComponent), { ssr: false });