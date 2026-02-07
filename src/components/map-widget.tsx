"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Provided by user
mapboxgl.accessToken = "pk.eyJ1Ijoic2F5YW5yb29yIiwiYSI6ImNtZ2xiNXI3aTB2eGYybHIwN2hmYTZkczIifQ.P3c9t5awEl7pzy1pX5KseA";

interface MapWidgetProps {
    className?: string;
}

export function MapWidget({ className }: MapWidgetProps): React.ReactElement {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);

    // Coordinates for Dostyk 132B, Almaty
    const lng = 76.9589;
    const lat = 43.2435;
    const zoom = 14;

    useEffect(() => {
        if (map.current || !mapContainer.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/dark-v11",
            center: [lng, lat],
            zoom: zoom,
            attributionControl: false,
        });

        // Add navigation controls (zoom in/out) but keep it minimal
        map.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

        // Add a custom marker
        const markerEl = document.createElement("div");
        markerEl.className = "custom-marker";
        markerEl.style.width = "20px";
        markerEl.style.height = "20px";
        markerEl.style.borderRadius = "50%";
        markerEl.style.backgroundColor = "var(--accent, #3b82f6)";
        markerEl.style.border = "4px solid white";
        markerEl.style.boxShadow = "0 0 20px var(--accent, #3b82f6)";

        new mapboxgl.Marker(markerEl)
            .setLngLat([lng, lat])
            .addTo(map.current);

        // Disable scroll zoom for footer widget
        map.current.scrollZoom.disable();

        return (): void => {
            map.current?.remove();
            map.current = null;
        };
    }, []);

    return (
        <div className={`relative w-full h-full rounded-3xl overflow-hidden border border-border/40 ${className}`}>
            <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background/40 to-transparent" />
        </div>
    );
}
