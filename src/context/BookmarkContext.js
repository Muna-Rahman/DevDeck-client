'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const BookmarkContext = createContext();

export function BookmarkProvider({ children }) {
  const [bookmarkedCards, setBookmarkedCards] = useState([]);
  const [loading, setLoading] = useState(true);

  // Safely links data parameters back to your dynamic Express engine ports
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/api/cards/bookmarks`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include" // Keeps user sessions isolated
      });
      if (res.ok) {
        const data = await res.json();
        setBookmarkedCards(data);
      }
    } catch (err) {
      console.error("Error pulling bookmarked metadata:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = async (cardId) => {
    try {
      // 1. Check if the target item exists in current local state or is a snippet
      const existingItem = bookmarkedCards.find(
        (c) => (c._id || c.id)?.toString() === cardId?.toString()
      );
      
      const isSnippet = existingItem?.type === 'Snippet' || existingItem?.type === 'snippets';
      
      // Determine the correct API endpoint and payload depending on item source
      const endpoint = isSnippet
        ? `${backendUrl}/api/snippets/${cardId}`
        : `${backendUrl}/api/cards/${cardId}/bookmark`;

      const currentBookmarkState = existingItem?.isBookmarked ?? existingItem?.bookmarked ?? false;

      const res = await fetch(endpoint, { 
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: isSnippet ? JSON.stringify({ bookmarked: !currentBookmarkState }) : undefined
      });

      if (res.ok) {
        const updatedCard = await res.json();
        
        // Normalize properties for consistent UI state checks
        const isNowBookmarked = updatedCard.isBookmarked ?? updatedCard.bookmarked ?? false;
        
        if (isNowBookmarked) {
          setBookmarkedCards((prev) => {
            const exists = prev.some(c => (c._id || c.id)?.toString() === (updatedCard._id || updatedCard.id)?.toString());
            return exists ? prev : [...prev, updatedCard];
          });
        } else {
          setBookmarkedCards((prev) => 
            prev.filter(card => (card._id || card.id)?.toString() !== cardId?.toString())
          );
        }

        // Re-fetch to guarantee complete server-state synchronization
        await fetchBookmarks();

        return updatedCard;
      }
    } catch (err) {
      console.error("Could not modify bookmark state:", err);
    }
    return null;
  };

  useEffect(() => {
    fetchBookmarks();
  }, [backendUrl]);

  return (
    <BookmarkContext.Provider value={{ bookmarkedCards, toggleBookmark, loading, refreshBookmarks: fetchBookmarks }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export const useBookmarks = () => useContext(BookmarkContext);