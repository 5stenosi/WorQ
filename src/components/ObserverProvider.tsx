"use client";
import { Observer } from "tailwindcss-intersect";
import { useEffect } from "react";

// ObserverProvider initializes the Intersection Observer for Tailwind CSS utilities
export default function ObserverProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    // Start the observer when the component mounts
    useEffect(() => {
        Observer.start();
    }, []);

    // Render children as-is
    return <>{children}</>;
}