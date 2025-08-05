"use client";

import useSWR from "swr";
import { useState, useCallback } from "react";

// API route fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Server action fetcher (for server actions)
const actionFetcher = (action: Function, ...args: any[]) => action(...args);

/**
 * Hook for venue search with debouncing and caching
 */
export function useVenueSearch(initialQuery: string = "") {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  // Debounce the search query
  const debounceTimeout = useCallback(
    debounce((newQuery: string) => {
      setDebouncedQuery(newQuery);
    }, 300),
    []
  );

  const updateQuery = useCallback((newQuery: string) => {
    setQuery(newQuery);
    debounceTimeout(newQuery);
  }, [debounceTimeout]);

  const { data, error, isLoading, mutate } = useSWR(
    debouncedQuery.length >= 3 ? `/api/venues/search?q=${debouncedQuery}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000, // 30 seconds
    }
  );

  return {
    query,
    results: data || [],
    isLoading,
    error,
    updateQuery,
    refetch: mutate,
  };
}

/**
 * Hook for paginated venues
 */
export function useVenues(limit: number = 50, offset: number = 0) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/venues?limit=${limit}&offset=${offset}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
    }
  );

  return {
    venues: data?.venues || [],
    total: data?.total || 0,
    isLoading,
    error,
    refetch: mutate,
  };
}

/**
 * Hook for listings with caching
 */
export function useListings(limit: number = 100, showHistorical: boolean = false) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/listings?limit=${limit}&historical=${showHistorical}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 120000, // 2 minutes
    }
  );

  return {
    listings: data || [],
    isLoading,
    error,
    refetch: mutate,
  };
}

/**
 * Hook for single venue with caching
 */
export function useVenue(id: number | null) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/venues/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
    }
  );

  return {
    venue: data,
    isLoading,
    error,
    refetch: mutate,
  };
}

// Utility function for debouncing
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
