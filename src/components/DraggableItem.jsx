// src/components/DraggableItem.jsx
import React from 'react';
import { useDraggable } from '@dnd-kit/core';

const DraggableItem = ({ id, children }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ padding: '16px', margin: '8px', backgroundColor: 'lightgray', cursor: 'move' }}
    >
      {children}
    </div>
  );
};

export default DraggableItem;
