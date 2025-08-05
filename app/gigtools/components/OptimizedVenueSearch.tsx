"use client";

import { useState } from "react";
import { useVenueSearch, useVenues } from "@/app/gigtools/hooks/useData";

export default function OptimizedVenueSearch() {
  const [selectedVenue, setSelectedVenue] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 20;

  // Use the optimized search hook
  const { 
    query, 
    results: searchResults, 
    isLoading: isSearching, 
    updateQuery 
  } = useVenueSearch();

  // Use the paginated venues hook
  const { 
    venues, 
    total, 
    isLoading: isLoadingVenues, 
    refetch 
  } = useVenues(pageSize, currentPage * pageSize);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Search Venues</h2>
        <div className="flex flex-col space-y-2">
          <input
            type="text"
            placeholder="Search venues (min 3 characters)..."
            value={query}
            onChange={(e) => updateQuery(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          {isSearching && (
            <div className="text-sm text-gray-500">Searching...</div>
          )}
          
          {query.length >= 3 && searchResults.length > 0 && (
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md">
              {searchResults.map((venue: any) => (
                <div
                  key={venue.id}
                  onClick={() => setSelectedVenue(venue)}
                  className="p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium">{venue.name}</div>
                  <div className="text-sm text-gray-500">{venue.suburb}, {venue.state}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Selected Venue */}
      {selectedVenue && (
        <div className="p-4 bg-blue-50 rounded-md">
          <h3 className="font-semibold text-lg">{selectedVenue.name}</h3>
          <p className="text-gray-600">{selectedVenue.address1}</p>
          <p className="text-gray-600">{selectedVenue.suburb}, {selectedVenue.state} {selectedVenue.postcode}</p>
          {selectedVenue.url && (
            <a 
              href={selectedVenue.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Visit Website
            </a>
          )}
        </div>
      )}

      {/* Paginated Venues List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">All Venues</h2>
          <div className="text-sm text-gray-500">
            Showing {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, total)} of {total}
          </div>
        </div>

        {isLoadingVenues ? (
          <div className="text-center py-8">Loading venues...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {venues.map((venue: any) => (
              <div
                key={venue.id}
                className="p-4 border border-gray-200 rounded-md hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedVenue(venue)}
              >
                <h3 className="font-semibold">{venue.name}</h3>
                <p className="text-sm text-gray-600">{venue.suburb}, {venue.state}</p>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            
            <span className="px-3 py-1 text-sm text-gray-600">
              Page {currentPage + 1} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
