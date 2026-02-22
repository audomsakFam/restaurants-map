import type { RestaurantResult } from "../types/serach";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

export async function searchRestaurants(
  keyword: string,
  signal?: AbortSignal,
): Promise<RestaurantResult[]> {
  const trimmed = keyword.trim();
  if (!trimmed) return [];

  const url = `${API_BASE_URL}/search?keyword=${encodeURIComponent(trimmed)}`;
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Search failed with status ${response.status}`);
  }

  const body = (await response.json()) as { data?: RestaurantResult[] };
  return body.data ?? [];
}

export async function fetchSuggestions(
  keyword: string,
  signal?: AbortSignal,
): Promise<string[]> {
  const trimmed = keyword.trim();
  if (!trimmed) return [];

  const url = `${API_BASE_URL}/suggest?keyword=${encodeURIComponent(trimmed)}`;
  const response = await fetch(url, { signal });

  if (!response.ok) {
    return [];
  }

  const body = (await response.json()) as { data?: string[] };
  return Array.isArray(body.data) ? body.data.slice(0, 5) : [];
}
