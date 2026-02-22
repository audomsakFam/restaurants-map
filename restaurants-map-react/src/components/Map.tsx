/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import SearchBar from "./SearchBar";
import MapBounds from "./MapBounds";
import { fetchSuggestions, searchRestaurants } from "../services/search.service";
import type { RestaurantResult } from "../types/serach";

export default function Map() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<RestaurantResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const requestRef = useRef<AbortController | null>(null);
  const isSelectingSuggestion = useRef(false);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });
  }, []);

  const executeSearch = useCallback(
    async (value: string) => {
      const trimmed = value.trim();
      setQuery(value);

      if (!trimmed) {
        setResults([]);
        setError(null);
        return;
      }

      if (requestRef.current) {
        requestRef.current.abort();
      }

      const controller = new AbortController();
      requestRef.current = controller;
      setLoading(true);
      setError(null);
      setResults([]);

      try {
        const data = await searchRestaurants(trimmed, controller.signal);
        const arrayData = Array.isArray(data) ? data : [];
        const withCoordinates = arrayData.filter(
          (item) =>
            typeof item.latitude === "number" &&
            typeof item.longitude === "number",
        );
        console.log("search results", withCoordinates);
        setResults([...withCoordinates]);
        setSuggestions([]);
        if (arrayData.length === 0) {
          setToast(
            "Google Places API key missing. Please set GOOGLE_PLACES_API_KEY to enable external search.",
          );
          if (toastTimeoutRef.current) {
            clearTimeout(toastTimeoutRef.current);
          }
          toastTimeoutRef.current = setTimeout(() => {
            setToast(null);
            toastTimeoutRef.current = null;
          }, 3500);
        }
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error("Failed to search restaurants", err);
        setError("Search failed. Please try again.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const defaultCenter: [number, number] = [13.7563, 100.5018];
  const mapCenter: [number, number] = results.length
    ? [
        results[0].latitude ?? defaultCenter[0],
        results[0].longitude ?? defaultCenter[1],
      ]
    : defaultCenter;

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSuggestions([]);
      return;
    }

    if (isSelectingSuggestion.current) {
      isSelectingSuggestion.current = false;
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      try {
        const data = await fetchSuggestions(trimmed, controller.signal);
        setSuggestions(data);
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error("Failed to fetch suggestions", err);
      }
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [query]);

  const handleSelectSuggestion = (text: string) => {
    const name = text ?? "";
    isSelectingSuggestion.current = true;
    setSuggestions([]);
    setQuery(name);
    executeSearch(name);
  };

  return (
    <div className="relative h-screen w-full">
      <SearchBar
        value={query}
        onChange={(val) => {
          isSelectingSuggestion.current = false;
          setQuery(val);
        }}
        onSubmit={executeSearch}
        suggestions={suggestions}
        onSelectSuggestion={handleSelectSuggestion}
        placeholder="Search restaurants..."
      />

      {loading && (
        <div className="pointer-events-none absolute left-1/2 top-20 z-1000 -translate-x-1/2 px-3">
          <div className="pointer-events-auto rounded-md bg-white px-4 py-2 text-sm text-gray-800 shadow ring-1 ring-gray-200">
            Searching…
          </div>
        </div>
      )}

      {error && (
        <div className="pointer-events-none absolute left-1/2 top-20 z-1000 -translate-x-1/2 px-3">
          <div className="pointer-events-auto rounded-md bg-red-50 px-4 py-2 text-sm text-red-700 shadow ring-1 ring-red-200">
            {error}
          </div>
        </div>
      )}

      {toast && (
        <div className="pointer-events-none absolute left-1/2 top-32 z-1000 -translate-x-1/2 px-3">
          <div className="pointer-events-auto rounded-md bg-amber-50 px-4 py-2 text-sm text-amber-800 shadow ring-1 ring-amber-200">
            {toast}
          </div>
        </div>
      )}

      <MapContainer
        center={mapCenter}
        zoom={16}
        // scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBounds results={results} />
        {results.map((restaurant) => (
          <Marker
            key={restaurant.id}
            position={[restaurant.latitude, restaurant.longitude]}
          >
            <Popup>
              <div>
                <p className="font-medium text-gray-900">{restaurant.name}</p>
                <p className="text-sm text-gray-700">{restaurant.address}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
