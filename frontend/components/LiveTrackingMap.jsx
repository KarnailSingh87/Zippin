import React, { useEffect, useRef, useState } from "react";

export default function LiveTrackingMap({
  order,
  riderLocation,
  storeLocation,
  dynamicEta = 8,
  distanceMatrix = 1.2,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const riderMarkerRef = useRef(null);
  const polylineRef = useRef(null);

  const [mapTheme, setMapTheme] = useState("street"); // street | satellite | dark
  const [currentRiderPos, setCurrentRiderPos] = useState(null);
  const [isFollowing, setIsFollowing] = useState(true);

  // Normalize coordinates for single-branch Hamirpur store catchment
  // Hamirpur Store #501 coordinates: 31.6862° N, 76.5213° E
  const storeLat = 31.6862;
  const storeLng = 76.5213;

  // Delivery destination coordinates (Hamirpur locality)
  const destLat = 31.6938;
  const destLng = 76.5279;

  // Initial rider location: between store and destination
  const initialRiderLat =
    riderLocation?.latitude && riderLocation.latitude !== 28.4595
      ? riderLocation.latitude
      : 31.6896;
  const initialRiderLng =
    riderLocation?.longitude && riderLocation.longitude !== 77.0266
      ? riderLocation.longitude
      : 76.5245;

  const partnerName =
    order?.partner?.name ||
    order?.partner?.firstName ||
    "Mohan Sharma";
  const partnerPhone = order?.partner?.phone || "+91 98160 12345";
  const vehicle = order?.partner?.vehicleType || "Electric Scooter (EV-HP22)";

  // Initialize Leaflet Map
  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;
    const L = require("leaflet");

    // Clear existing instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const startRiderLat = currentRiderPos?.lat || initialRiderLat;
    const startRiderLng = currentRiderPos?.lng || initialRiderLng;

    // Create Map
    const map = L.map(mapContainerRef.current, {
      center: [startRiderLat, startRiderLng],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
    });
    mapInstanceRef.current = map;

    // Custom Zoom Control top-right
    L.control.zoom({ position: "topright" }).addTo(map);

    // Tile Layers based on Theme
    const tileLayers = {
      street: L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
        subdomains: "abcd",
      }),
      dark: L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
        subdomains: "abcd",
      }),
      satellite: L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 18,
      }),
    };

    tileLayers[mapTheme].addTo(map);

    // Custom HTML Icons
    const storeIcon = L.divIcon({
      className: "custom-store-pin",
      html: `
        <div class="relative flex flex-col items-center">
          <div class="w-10 h-10 rounded-2xl bg-emerald-700 text-white border-2 border-white shadow-xl flex items-center justify-center text-xl font-bold ring-4 ring-emerald-500/20">
            🏬
          </div>
          <span class="mt-1 bg-gray-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md whitespace-nowrap">
            Hamirpur Hub #501
          </span>
        </div>
      `,
      iconSize: [40, 50],
      iconAnchor: [20, 25],
    });

    const destIcon = L.divIcon({
      className: "custom-dest-pin",
      html: `
        <div class="relative flex flex-col items-center">
          <div class="w-10 h-10 rounded-2xl bg-rose-600 text-white border-2 border-white shadow-xl flex items-center justify-center text-xl font-bold ring-4 ring-rose-500/20">
            🏠
          </div>
          <span class="mt-1 bg-rose-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md whitespace-nowrap">
            Delivery: ${order?.deliveryAddress?.street || "Gandhi Chowk"}
          </span>
        </div>
      `,
      iconSize: [40, 50],
      iconAnchor: [20, 25],
    });

    const riderIcon = L.divIcon({
      className: "custom-rider-pin",
      html: `
        <div class="relative flex flex-col items-center">
          <span class="absolute -top-1 w-12 h-12 rounded-full bg-emerald-500/30 animate-ping"></span>
          <span class="absolute -top-1 w-10 h-10 rounded-full bg-emerald-400/40 animate-pulse"></span>
          <div class="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-500 text-white border-2 border-white shadow-2xl flex items-center justify-center text-2xl ring-4 ring-emerald-400/30">
            🛵
          </div>
          <span class="mt-1 bg-emerald-700 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-lg whitespace-nowrap flex items-center gap-1 border border-emerald-400">
            <span class="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
            ${partnerName} (${dynamicEta}m)
          </span>
        </div>
      `,
      iconSize: [44, 55],
      iconAnchor: [22, 28],
    });

    // Add Markers
    L.marker([storeLat, storeLng], { icon: storeIcon })
      .bindPopup("<b>Zippin Store #501</b><br/>Hamirpur District Hub (Dispatched)")
      .addTo(map);

    L.marker([destLat, destLng], { icon: destIcon })
      .bindPopup(`<b>Delivery Destination</b><br/>${order?.deliveryAddress?.street || "Hamirpur, HP"}`)
      .addTo(map);

    const riderMarker = L.marker([startRiderLat, startRiderLng], {
      icon: riderIcon,
      zIndexOffset: 1000,
    })
      .bindPopup(`<b>${partnerName}</b><br/>Delivery Partner en route (${dynamicEta} min away)`)
      .addTo(map);
    riderMarkerRef.current = riderMarker;

    // Draw Route Polylines
    // 1. Completed leg: Store to Rider
    const completedLine = L.polyline(
      [
        [storeLat, storeLng],
        [startRiderLat, startRiderLng],
      ],
      {
        color: "#059669",
        weight: 5,
        opacity: 0.8,
        smoothFactor: 1,
      }
    ).addTo(map);

    // 2. Remaining leg: Rider to Customer Destination (dashed)
    const remainingLine = L.polyline(
      [
        [startRiderLat, startRiderLng],
        [destLat, destLng],
      ],
      {
        color: "#10b981",
        weight: 5,
        dashArray: "8, 10",
        opacity: 0.9,
      }
    ).addTo(map);
    polylineRef.current = { completedLine, remainingLine };

    // Fit map bounds to view all markers with comfortable margin
    map.fitBounds(
      [
        [storeLat, storeLng],
        [startRiderLat, startRiderLng],
        [destLat, destLng],
      ],
      { padding: [60, 60], maxZoom: 16 }
    );

    // Invalidate size once rendered
    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapTheme]);

  // Simulated GPS Telemetry & Progress Movement
  useEffect(() => {
    let progress = 0.45;
    const interval = setInterval(() => {
      progress = Math.min(0.92, progress + 0.015);
      const newLat = storeLat + (destLat - storeLat) * progress;
      const newLng = storeLng + (destLng - storeLng) * progress;

      setCurrentRiderPos({ lat: newLat, lng: newLng });

      if (riderMarkerRef.current && mapInstanceRef.current) {
        riderMarkerRef.current.setLatLng([newLat, newLng]);

        if (polylineRef.current) {
          polylineRef.current.completedLine.setLatLngs([
            [storeLat, storeLng],
            [newLat, newLng],
          ]);
          polylineRef.current.remainingLine.setLatLngs([
            [newLat, newLng],
            [destLat, destLng],
          ]);
        }

        if (isFollowing) {
          mapInstanceRef.current.panTo([newLat, newLng], { animate: true, duration: 1.0 });
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isFollowing]);

  function handleCenterRider() {
    if (mapInstanceRef.current && currentRiderPos) {
      mapInstanceRef.current.flyTo([currentRiderPos.lat, currentRiderPos.lng], 16, {
        animate: true,
        duration: 1.2,
      });
      setIsFollowing(true);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-gray-100">
      {/* Top Header Card */}
      <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-emerald-50/50 via-white to-gray-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-base shadow-xs">
            🗺️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-gray-800">
                Live Rider GPS Tracking
              </h2>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/70 border border-emerald-300 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
                GPS Active
              </span>
            </div>
            <p className="text-[11px] text-gray-500 font-medium">
              Hamirpur Central Hub • 10-Minute Delivery Route
            </p>
          </div>
        </div>

        {/* Map Theme Toggle */}
        <div className="flex items-center bg-gray-100 p-0.5 rounded-xl text-xs font-semibold">
          {[
            { id: "street", label: "Street" },
            { id: "satellite", label: "Satellite" },
            { id: "dark", label: "Night" },
          ].map((theme) => (
            <button
              key={theme.id}
              onClick={() => setMapTheme(theme.id)}
              className={`px-3 py-1 rounded-lg transition-all ${
                mapTheme === theme.id
                  ? "bg-white text-gray-900 shadow-xs font-bold"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {theme.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Map Canvas Container */}
      <div className="relative w-full h-80 sm:h-96 bg-slate-100">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Telemetry Glassmorphism Badge */}
        <div className="absolute top-3 left-3 z-[400] bg-white/95 backdrop-blur-md rounded-xl p-2.5 shadow-lg border border-gray-200/80 max-w-xs text-xs space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[11px] font-bold text-gray-600">Coordinates:</span>
            <span className="font-mono text-[11px] font-bold text-emerald-700">
              {(currentRiderPos?.lat || initialRiderLat).toFixed(4)}° N,{" "}
              {(currentRiderPos?.lng || initialRiderLng).toFixed(4)}° E
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 pt-1 border-t border-gray-100">
            <span className="text-[11px] text-gray-500">Dispatch Hub:</span>
            <span className="text-[11px] font-semibold text-gray-800">
              Store #501 (Gandhi Chowk)
            </span>
          </div>
        </div>

        {/* Floating Recenter Button */}
        <button
          onClick={handleCenterRider}
          className="absolute bottom-4 right-4 z-[400] bg-white hover:bg-gray-50 text-gray-800 text-xs font-bold px-3.5 py-2 rounded-xl shadow-lg border border-gray-200 flex items-center gap-1.5 transition-transform active:scale-95"
          title="Recenter map on rider"
        >
          <span>🎯</span> Focus Rider
        </button>
      </div>

      {/* Rider & Delivery Telemetry Footer HUD */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Partner Info */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center shadow-md border-2 border-white">
                {partnerName.charAt(0)}
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">
                ✓
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-gray-800">{partnerName}</h4>
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded-md">
                  ★ 4.9
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                {vehicle} • Zippin Verified Partner
              </p>
            </div>
          </div>

          {/* Quick Metrics & Call Actions */}
          <div className="flex items-center gap-2.5">
            <div className="bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl text-center">
              <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                Dynamic ETA
              </p>
              <p className="text-sm font-black text-emerald-800">
                {dynamicEta} mins ⚡
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-center">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                Distance
              </p>
              <p className="text-sm font-black text-gray-800">
                ~{distanceMatrix.toFixed(1)} km
              </p>
            </div>
            <a
              href={`tel:${partnerPhone}`}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <span>📞</span> Call
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
