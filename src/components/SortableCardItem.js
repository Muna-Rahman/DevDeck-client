'use client';
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import CardItem from './CardItem';

// Wraps CardItem with dnd-kit sortable behaviour. The whole card can be grabbed with the
// pointer (the sensor's distance threshold keeps plain clicks opening the drawer), and the
// grip handle additionally gives keyboard users a way to drag.
export default function SortableCardItem({ card, ...cardItemProps }) {
  const id = card._id || card.id;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.6 : 1,
    touchAction: 'manipulation',
  };

  return (
    <div ref={setNodeRef} style={style} onPointerDown={listeners?.onPointerDown} className="cursor-grab active:cursor-grabbing">
      <CardItem card={card} dragHandleProps={{ ...attributes, ...listeners }} {...cardItemProps} />
    </div>
  );
}