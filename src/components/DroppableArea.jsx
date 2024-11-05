// src/components/DroppableArea.jsx
import React from 'react';
import { useDroppable } from '@dnd-kit/core';

const DroppableArea = ({ id, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        padding: '16px',
        margin: '8px',
        border: '1px solid black',
        backgroundColor: isOver ? 'lightgreen' : 'white',
      }}
    >
      {children}
    </div>
  );
};

export default DroppableArea;
