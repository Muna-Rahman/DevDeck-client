'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useBookmarks } from '@/context/BookmarkContext';
import CardItem from '../../components/CardItem';
import CardDetailsDrawer from '../../components/CardDetailsDrawer';
import { Bookmark, LayoutCellsLarge, ArrowLeft } from '@gravity-ui/icons';

export default function BookmarksPage() {
  const { bookmarkedCards, loading, refreshBookmarks, toggleBookmark } = useBookmarks();
  const [selectedCard, setSelectedCard] = useState(null);

  const handleBookmarkToggleFromDrawer = async (cardId) => {
    await toggleBookmark(cardId);
    setSelectedCard(null); // Instantly closes details overlay context upon vault clearing shifts
    refreshBookmarks();
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] p-6 lg:p-10 relative overflow-hidden">
      {/* Background atmospheric radial gradients layout */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#E94FD1]/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#3FE0C5]/10 blur-[150px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto relative z-10">
        
        {/* Navigation Return Pill Header Element */}
        <div className="mb-6">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-md text-[#9CA3B5] hover:text-white hover:bg-white/[0.06] hover:border-white/10 hover:shadow-[0_0_15px_rgba(63,224,197,0.1)] transition-all duration-300"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#3FE0C5]" />
            Return to Dashboard
          </Link>
        </div>
        
        {/* Header segment information matrices */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-white/[0.06] pb-6">
          <div>
            <div className="flex items-center gap-2 text-[#E94FD1] mb-1">
              <Bookmark className="w-5 h-5 text-[#E94FD1]" />
              <span className="text-xs uppercase tracking-widest font-bold font-mono">Vault Storage</span>
            </div>
            <h1 className="text-3xl font-medium text-[#F5F6FA] tracking-tight">
              Bookmarked Resources
            </h1>
            <p className="text-sm text-[#9CA3B5] mt-1">
              Quick access control panel holding your critical workspace cards.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.06] px-4 py-2 rounded-xl backdrop-blur-md">
            <LayoutCellsLarge className="w-4 h-4 text-[#3FE0C5]" />
            <span className="text-xs text-[#9CA3B5] font-mono">
              Total Safe Items: <strong className="text-[#F5F6FA]">{bookmarkedCards.length}</strong>
            </span>
          </div>
        </div>

        {/* Dynamic Display Grid Matrix states */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-48 rounded-2xl bg-white/[0.02] border border-white/[0.05] animate-pulse" />
            ))}
          </div>
        ) : bookmarkedCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-24 rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01] backdrop-blur-sm">
            <div className="w-16 h-16 rounded-full bg-[#1A1D29] border border-white/[0.08] flex items-center justify-center mb-4 text-[#9CA3B5]">
              <Bookmark className="w-6 h-6 text-[#9CA3B5]/40" />
            </div>
            <h3 className="text-lg font-medium text-[#F5F6FA] mb-1">No bookmarked cards encountered</h3>
            <p className="text-sm text-[#9CA3B5] max-w-sm mb-6">
              Go to your core dashboard workspace setup parameters and toggle the bookmark flags.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarkedCards.map((card) => (
              <CardItem 
                key={card._id || card.id} 
                card={card} 
                onCardUpdate={() => refreshBookmarks()} 
                onSelectCard={(c) => setSelectedCard(c)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Glassmorphic Inspector Board Overlay Drawer */}
      <CardDetailsDrawer 
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
        onToggleBookmark={handleBookmarkToggleFromDrawer}
      />
    </div>
  );
}