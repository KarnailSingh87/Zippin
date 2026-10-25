import React, { useEffect, useRef } from "react";

export default function StoreMapPicker({ lat, lng, storeName, storeAddress, onLocationSelect }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const currentLat = Number(lat) || 31.6862;
  const currentLng = Number(lng) || 76.5213;

  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;
    const L = require("leaflet");

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [currentLat, currentLng],
        zoom: 15,
        zoomControl: true,
        attributionControl: false,
      });
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
        subdomains: "abcd",
      }).addTo(map);

      const storeIcon = L.divIcon({
        className: "custom-store-pin",
        html: `
          <div class="relative flex flex-col items-center">
            <div class="w-10 h-10 rounded-2xl bg-emerald-600 text-white border-2 border-white shadow-xl flex items-center justify-center text-xl font-bold ring-4 ring-emerald-500/20 cursor-grab active:cursor-grabbing">
              🏬
            </div>
            <span class="mt-1 bg-gray-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap">
              Store Origin
            </span>
          </div>
        `,
        iconSize: [40, 50],
        iconAnchor: [20, 25],
      });

      const marker = L.marker([currentLat, currentLng], {
        icon: storeIcon,
        draggable: true,
      }).addTo(map);
      markerRef.current = marker;

      marker.bindPopup(`<b>${storeName || "Store Origin"}</b><br/>${storeAddress || "Click or drag to relocate"}`).openPopup();

      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        onLocationSelect(Number(pos.lat.toFixed(5)), Number(pos.lng.toFixed(5)));
      });

      map.on("click", (e) => {
        marker.setLatLng(e.latlng);
        map.panTo(e.latlng);
        onLocationSelect(Number(e.latlng.lat.toFixed(5)), Number(e.latlng.lng.toFixed(5)));
      });
    } else {
      if (markerRef.current) {
        markerRef.current.setLatLng([currentLat, currentLng]);
        mapInstanceRef.current.panTo([currentLat, currentLng]);
      }
    }
  }, [currentLat, currentLng, storeName, storeAddress, onLocationSelect]);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm bg-gray-100 dark:bg-gray-900">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      <div className="absolute bottom-3 left-3 z-[400] bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-gray-200/80 dark:border-gray-800 text-xs shadow-md">
        <span className="text-gray-500 dark:text-gray-400 font-medium mr-1.5">Selected Origin:</span>
        <span className="font-mono font-bold text-[#0C831F] dark:text-emerald-400">
          {currentLat.toFixed(5)}° N, {currentLng.toFixed(5)}° E
        </span>
      </div>
      <div className="absolute top-3 right-3 z-[400] bg-black/70 text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg backdrop-blur-xs pointer-events-none">
        Click or drag pin to move store
      </div>
    </div>
  );
}
