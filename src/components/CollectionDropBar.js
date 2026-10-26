'use client';
import React from 'react';
import { useDroppable } from '@dnd-kit/core';

export const COLLECTION_DROP_PREFIX = 'collection:';

function CollectionChip({ name, isCurrent }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `${COLLECTION_DROP_PREFIX}${name}`,
    disabled: isCurrent, // dropping onto the collection the card is already in does nothing
  });

  return (
    <div
      ref={setNodeRef}
      className={`px-4 py-2 rounded-xl border text-xs font-mono font-bold uppercase tracking-wider transition-all duration-150 ${
        isCurrent
          ? 'opacity-40 border-white/10 text-[#9CA3B5]'
          : isOver
            ? 'scale-105 border-[#3FE0C5] bg-[#3FE0C5]/20 text-[#3FE0C5] shadow-[0_0_20px_rgba(63,224,197,0.35)]'
            : 'border-white/15 bg-white/[0.04] text-[#F5F6FA]'
      }`}
    >
      {name}
    </div>
  );
}

// Floating bar shown only while a card is being dragged. Each chip is a drop target
// that moves the dragged card into that collection (category).
export default function CollectionDropBar({ collections, currentCollection }) {
  if (!collections.length) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] max-w-[92vw] flex flex-col items-center gap-2 p-3 rounded-2xl border border-white/10 bg-[#0B0E14]/90 backdrop-blur-xl shadow-2xl">
      <span className="text-[10px] font-mono uppercase tracking-widest text-[#9CA3B5]">Drop on a collection to move</span>
      <div className="flex flex-wrap justify-center gap-2 overflow-y-auto max-h-32">
        {collections.map((name) => (
          <CollectionChip key={name} name={name} isCurrent={name === currentCollection} />
        ))}
      </div>
    </div>
  );
}