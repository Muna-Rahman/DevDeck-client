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
      const res = await fetch(`${backendUrl}/api/cards/${cardId}/bookmark`, { 
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });
      if (res.ok) {
        const updatedCard = await res.json();
        
        if (updatedCard.isBookmarked) {
          setBookmarkedCards((prev) => {
            const exists = prev.some(c => (c._id || c.id) === (updatedCard._id || updatedCard.id));
            return exists ? prev : [...prev, updatedCard];
          });
        } else {
          setBookmarkedCards((prev) => prev.filter(card => (card._id || card.id) !== cardId));
        }
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