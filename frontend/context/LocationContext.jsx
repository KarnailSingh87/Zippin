import React, { createContext, useContext, useState, useEffect } from "react";

const LocationContext = createContext();

// Known Dark Store Hubs per District/State serving as store origins
export const DISTRICT_DARK_STORES = [
  {
    id: "str-hmr-501",
    name: "Zippin Dark Store #501 - Hamirpur District Hub",
    district: "Hamirpur",
    city: "Hamirpur",
    state: "Himachal Pradesh",
    area: "Gandhi Chowk / District Center",
    address: "Near Main Bus Stand & Gandhi Chowk, Hamirpur",
    pincode: "177001",
    coordinates: { lat: 31.6862, lng: 76.5213 },
    deliveryRadiusKm: 12.0,
    surgeMultiplier: 1.0,
  },
  {
    id: "str-gur-102",
    name: "Zippin Dark Store #102 - Sector 43 Hub",
    district: "Gurugram",
    city: "Gurugram",
    state: "Haryana",
    area: "Sector 43 / Golf Course Road",
    address: "Near Golf Course Road, Sector 43, Gurugram",
    pincode: "122009",
    coordinates: { lat: 28.4595, lng: 77.0266 },
    deliveryRadiusKm: 5.0,
    surgeMultiplier: 1.0,
  },
  {
    id: "str-gur-101",
    name: "Zippin Dark Store #101 - Cyber Hub",
    district: "Gurugram",
    city: "Gurugram",
    state: "Haryana",
    area: "Cyber City Phase 2",
    address: "Ground Floor, Tower B, DLF Cyber City",
    pincode: "122002",
    coordinates: { lat: 28.4952, lng: 77.0892 },
    deliveryRadiusKm: 4.5,
    surgeMultiplier: 1.0,
  },
  {
    id: "str-del-201",
    name: "Zippin Dark Store #201 - Saket District Hub",
    district: "South Delhi",
    city: "New Delhi",
    state: "Delhi",
    area: "Saket Community Centre",
    address: "Community Centre, Saket, New Delhi",
    pincode: "110017",
    coordinates: { lat: 28.5244, lng: 77.2167 },
    deliveryRadiusKm: 4.0,
    surgeMultiplier: 1.0,
  },
  {
    id: "str-del-202",
    name: "Zippin Dark Store #202 - Hauz Khas Hub",
    district: "New Delhi",
    city: "New Delhi",
    state: "Delhi",
    area: "Hauz Khas / Aurobindo Marg",
    address: "Aurobindo Marg, Hauz Khas, New Delhi",
    pincode: "110016",
    coordinates: { lat: 28.5494, lng: 77.2001 },
    deliveryRadiusKm: 4.2,
    surgeMultiplier: 1.0,
  },
  {
    id: "str-noi-301",
    name: "Zippin Dark Store #301 - Sector 18 Hub",
    district: "Gautam Buddha Nagar",
    city: "Noida",
    state: "Uttar Pradesh",
    area: "Atta Market Sector 18",
    address: "Sector 18, Noida",
    pincode: "201301",
    coordinates: { lat: 28.5708, lng: 77.3271 },
    deliveryRadiusKm: 5.0,
    surgeMultiplier: 1.0,
  },
  {
    id: "str-blr-301",
    name: "Zippin Dark Store #301 - Indiranagar 100ft Hub",
    district: "Bengaluru Urban",
    city: "Bengaluru",
    state: "Karnataka",
    area: "100 Feet Road, HAL 2nd Stage",
    address: "100 Feet Road, Indiranagar, Bengaluru",
    pincode: "560038",
    coordinates: { lat: 12.9716, lng: 77.6412 },
    deliveryRadiusKm: 5.5,
    surgeMultiplier: 1.0,
  },
  {
    id: "str-blr-302",
    name: "Zippin Dark Store #302 - Koramangala 4th Block",
    district: "Bengaluru Urban",
    city: "Bengaluru",
    state: "Karnataka",
    area: "80 Feet Road, Koramangala",
    address: "4th Block, Koramangala, Bengaluru",
    pincode: "560034",
    coordinates: { lat: 12.9352, lng: 77.6245 },
    deliveryRadiusKm: 4.8,
    surgeMultiplier: 1.0,
  },
  {
    id: "str-mum-501",
    name: "Zippin Dark Store #501 - Bandra West Hub",
    district: "Mumbai Suburban",
    city: "Mumbai",
    state: "Maharashtra",
    area: "Hill Road, Bandra West",
    address: "Hill Road, Bandra West, Mumbai",
    pincode: "400050",
    coordinates: { lat: 19.0596, lng: 72.8295 },
    deliveryRadiusKm: 4.5,
    surgeMultiplier: 1.0,
  },
  {
    id: "str-shm-502",
    name: "Zippin Dark Store #502 - Shimla Mall Road Hub",
    district: "Shimla",
    city: "Shimla",
    state: "Himachal Pradesh",
    area: "The Mall / Ridge",
    address: "Near The Ridge, Mall Road, Shimla",
    pincode: "171001",
    coordinates: { lat: 31.1048, lng: 77.1734 },
    deliveryRadiusKm: 8.0,
    surgeMultiplier: 1.0,
  },
];

/**
 * Calculate Great-Circle Distance (in km) using Haversine formula
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 2.0;
  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.max(0.3, Math.round(d * 10) / 10);
}

/**
 * Calculate Estimated Delivery Minutes based on distance from District Store origin:
 * - Base order packing & bag assembly time = 3 minutes
 * - Transit time = ~2.5 mins per kilometer
 * Example: 2 km distance -> 3 + (2 * 2.5) = 8 minutes
 */
export function calculateEstimatedDeliveryMinutes(distanceKm) {
  const dist = typeof distanceKm === "number" && !isNaN(distanceKm) ? distanceKm : 2.0;
  const packingTime = 3;
  const transitTime = dist * 2.5;
  const total = Math.round(packingTime + transitTime);
  return Math.max(5, total);
}

/**
 * Find the most relevant Dark Store taking the District or City as origin
 */
export function findOriginStoreForDistrict(districtOrCity = "", state = "", userCoords = null) {
  const qDist = (districtOrCity || "").toLowerCase().trim();
  const qState = (state || "").toLowerCase().trim();

  // 1. Direct match on District or City
  if (qDist) {
    const directMatch = DISTRICT_DARK_STORES.find(
      (s) =>
        s.district.toLowerCase().includes(qDist) ||
        s.city.toLowerCase().includes(qDist) ||
        qDist.includes(s.district.toLowerCase()) ||
        qDist.includes(s.city.toLowerCase())
    );
    if (directMatch) return directMatch;
  }

  // 2. Match on State (e.g. Himachal Pradesh -> Hamirpur or Shimla)
  if (qState) {
    const stateMatch = DISTRICT_DARK_STORES.find(
      (s) => s.state.toLowerCase().includes(qState) || qState.includes(s.state.toLowerCase())
    );
    if (stateMatch) return stateMatch;
  }

  // 3. Nearest by GPS Coordinates if available
  if (userCoords && userCoords.lat && userCoords.lng) {
    let nearest = DISTRICT_DARK_STORES[0];
    let minD = Infinity;
    for (const store of DISTRICT_DARK_STORES) {
      const d = calculateHaversineDistance(
        userCoords.lat,
        userCoords.lng,
        store.coordinates.lat,
        store.coordinates.lng
      );
      if (d < minD) {
        minD = d;
        nearest = store;
      }
    }
    return nearest;
  }

  // Default fallback to first dark store hub
  return DISTRICT_DARK_STORES[0];
}

export function LocationProvider({ children }) {
  const [currentLocation, setCurrentLocation] = useState("Hamirpur, Himachal Pradesh, India");
  const [district, setDistrict] = useState("Hamirpur");
  const [stateName, setStateName] = useState("Himachal Pradesh");
  const [pincode, setPincode] = useState("177001");
  const [distanceKm, setDistanceKm] = useState(2.0);
  const [deliveryMinutes, setDeliveryMinutes] = useState(8);
  const [originStore, setOriginStore] = useState(DISTRICT_DARK_STORES[0]);
  const [userCoords, setUserCoords] = useState({ lat: 31.6862, lng: 76.5213 });
  const [isDetecting, setIsDetecting] = useState(false);
  const [locationStatus, setLocationStatus] = useState(null);

  // Initialize from localStorage or default Hamirpur setup
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLocation = localStorage.getItem("zippin_user_location");
      const savedCity = localStorage.getItem("zippin_user_city");
      const savedState = localStorage.getItem("zippin_user_state");
      const savedPincode = localStorage.getItem("zippin_user_pincode");
      const savedDistance = localStorage.getItem("zippin_user_distance_km");
      const savedCoords = localStorage.getItem("zippin_user_coords");

      if (savedLocation) {
        setCurrentLocation(savedLocation);
        const dist = savedCity || "Hamirpur";
        setDistrict(dist);
        if (savedState) setStateName(savedState);
        if (savedPincode) setPincode(savedPincode);

        let coords = { lat: 31.6862, lng: 76.5213 };
        if (savedCoords) {
          try {
            coords = JSON.parse(savedCoords);
            setUserCoords(coords);
          } catch {}
        }

        const store = findOriginStoreForDistrict(dist, savedState || "", coords);
        setOriginStore(store);

        const dKm = savedDistance ? Number(savedDistance) : 2.0;
        setDistanceKm(dKm);
        setDeliveryMinutes(calculateEstimatedDeliveryMinutes(dKm));
      } else {
        // Default to Hamirpur District 2 km (8 mins) as specified
        const defDist = 2.0;
        setDistanceKm(defDist);
        setDeliveryMinutes(calculateEstimatedDeliveryMinutes(defDist));
        localStorage.setItem("zippin_user_location", "Hamirpur, Himachal Pradesh, India");
        localStorage.setItem("zippin_user_city", "Hamirpur");
        localStorage.setItem("zippin_user_state", "Himachal Pradesh");
        localStorage.setItem("zippin_user_pincode", "177001");
        localStorage.setItem("zippin_user_distance_km", "2.0");
        localStorage.setItem("zippin_delivery_time_mins", "8");
      }
    }
  }, []);

  /**
   * Set location manually from typed input or selection
   */
  function setManualLocation(locationName, customDistance = null, customCoords = null) {
    if (!locationName) return;

    // Parse district/city and state if formatted as "Hamirpur, Himachal Pradesh"
    const parts = locationName.split(",").map((p) => p.trim());
    const detectedDistrict = parts[0] || "Hamirpur";
    const detectedState = parts[1] || "";

    const store = findOriginStoreForDistrict(detectedDistrict, detectedState, customCoords);
    setOriginStore(store);

    let calculatedDist = 2.0;
    if (typeof customDistance === "number" && customDistance > 0) {
      calculatedDist = customDistance;
    } else if (customCoords && customCoords.lat && customCoords.lng) {
      calculatedDist = calculateHaversineDistance(
        customCoords.lat,
        customCoords.lng,
        store.coordinates.lat,
        store.coordinates.lng
      );
    } else {
      // Default distance for manually chosen district if not specified is 2.0 km
      calculatedDist = 2.0;
    }

    const etaMins = calculateEstimatedDeliveryMinutes(calculatedDist);

    setCurrentLocation(locationName);
    setDistrict(detectedDistrict);
    if (detectedState) setStateName(detectedState);
    setDistanceKm(calculatedDist);
    setDeliveryMinutes(etaMins);
    if (customCoords) setUserCoords(customCoords);

    if (typeof window !== "undefined") {
      localStorage.setItem("zippin_user_location", locationName);
      localStorage.setItem("zippin_user_city", detectedDistrict);
      if (detectedState) localStorage.setItem("zippin_user_state", detectedState);
      localStorage.setItem("zippin_user_distance_km", calculatedDist.toString());
      localStorage.setItem("zippin_delivery_time_mins", etaMins.toString());
      if (customCoords) {
        localStorage.setItem("zippin_user_coords", JSON.stringify(customCoords));
      }
    }
  }

  /**
   * Update distance manually (e.g. via slider or distance chips: 1km, 2km, 3km)
   */
  function updateDistance(newDistanceKm) {
    const dist = Math.max(0.3, Math.min(20, Number(newDistanceKm) || 2.0));
    const etaMins = calculateEstimatedDeliveryMinutes(dist);
    setDistanceKm(dist);
    setDeliveryMinutes(etaMins);
    if (typeof window !== "undefined") {
      localStorage.setItem("zippin_user_distance_km", dist.toString());
      localStorage.setItem("zippin_delivery_time_mins", etaMins.toString());
    }
  }

  /**
   * Detect User Location via Browser GPS Geolocation API
   */
  async function detectLocation() {
    if (typeof window === "undefined") return;
    if (!navigator.geolocation) {
      setLocationStatus({ type: "error", message: "GPS not supported on this browser" });
      return;
    }

    setIsDetecting(true);
    setLocationStatus({ type: "loading", message: "Acquiring GPS satellite fix..." });

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const { latitude, longitude } = pos.coords;
            setUserCoords({ lat: latitude, lng: longitude });
            setLocationStatus({ type: "loading", message: "Resolving street & dark store zone..." });

            // Reverse geocode via OpenStreetMap Nominatim
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=jsonv2&addressdetails=1`,
              { headers: { "Accept-Language": "en" } }
            );

            if (res.ok) {
              const data = await res.json();
              const addr = data.address || {};
              const locality =
                addr.neighbourhood ||
                addr.suburb ||
                addr.residential ||
                addr.road ||
                addr.village ||
                "";
              const detectedCity =
                addr.state_district ||
                addr.city ||
                addr.town ||
                addr.county ||
                "Hamirpur";
              const detectedState = addr.state || "Himachal Pradesh";
              const detectedPin = addr.postcode || "177001";

              const formatted = [locality, detectedCity, detectedState, detectedPin]
                .filter(Boolean)
                .join(", ");

              const matchedStore = findOriginStoreForDistrict(detectedCity, detectedState, {
                lat: latitude,
                lng: longitude,
              });
              setOriginStore(matchedStore);

              const dist = calculateHaversineDistance(
                latitude,
                longitude,
                matchedStore.coordinates.lat,
                matchedStore.coordinates.lng
              );
              const etaMins = calculateEstimatedDeliveryMinutes(dist);

              setCurrentLocation(formatted);
              setDistrict(detectedCity);
              setStateName(detectedState);
              setPincode(detectedPin);
              setDistanceKm(dist);
              setDeliveryMinutes(etaMins);

              localStorage.setItem("zippin_user_location", formatted);
              localStorage.setItem("zippin_user_city", detectedCity);
              localStorage.setItem("zippin_user_state", detectedState);
              localStorage.setItem("zippin_user_pincode", detectedPin);
              localStorage.setItem("zippin_user_distance_km", dist.toString());
              localStorage.setItem("zippin_delivery_time_mins", etaMins.toString());
              localStorage.setItem(
                "zippin_user_coords",
                JSON.stringify({ lat: latitude, lng: longitude })
              );

              setLocationStatus({
                type: "success",
                message: `Location detected: ${detectedCity} (${dist} km from store origin) • Delivery in ${etaMins} mins ⚡`,
              });
              resolve({ success: true, formatted, dist, etaMins });
            } else {
              throw new Error("Reverse geocoding error");
            }
          } catch (err) {
            console.warn("GPS lookup error, falling back:", err);
            // Fallback default
            setManualLocation("Hamirpur, Himachal Pradesh, India", 2.0);
            setLocationStatus({
              type: "success",
              message: "Defaulted to Hamirpur District Hub (2.0 km • 8 mins delivery)",
            });
            resolve({ success: true });
          } finally {
            setIsDetecting(false);
          }
        },
        (err) => {
          setIsDetecting(false);
          setLocationStatus({
            type: "error",
            message:
              err.code === 1
                ? "Location permission was denied. You can type your location manually below."
                : "GPS timed out. Please enter your location manually.",
          });
          resolve({ success: false, error: err.message });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  }

  const value = {
    currentLocation,
    district,
    stateName,
    pincode,
    distanceKm,
    deliveryMinutes,
    deliveryTimeText: `Delivery in ${deliveryMinutes} minutes`,
    originStore,
    userCoords,
    isDetecting,
    locationStatus,
    setLocationStatus,
    detectLocation,
    setManualLocation,
    updateDistance,
    stores: DISTRICT_DARK_STORES,
  };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}
export default LocationContext;
