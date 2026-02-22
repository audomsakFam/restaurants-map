import { useEffect } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";
import type { RestaurantResult } from "../types/serach";

type MapBoundsProps = {
  results: RestaurantResult[];
};

export default function MapBounds({ results }: MapBoundsProps) {
  const map = useMap();

  useEffect(() => {
    if (!results.length) return;

    const bounds = L.latLngBounds(
      results.map((restaurant) => [restaurant.latitude, restaurant.longitude]),
    );

    map.fitBounds(bounds, { padding: [50, 50] });
  }, [map, results]);

  return null;
}
