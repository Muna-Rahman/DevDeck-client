'use client';
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import CardItem from './CardItem';

// SortableCardItem is a wrapper around CardItem that adds drag-and-drop sorting functionality using @dnd-kit/sortable. It passes the necessary props to CardItem and applies the appropriate styles during dragging.
export default function SortableCardItem({ card, ...cardItemProps }) {
  const id = card._id || card.id;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <CardItem card={card} dragHandleProps={{ ...attributes, ...listeners }} {...cardItemProps} />
    </div>
  );
}