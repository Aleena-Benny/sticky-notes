import React from 'react';

interface TrashZoneProps {
  isActive: boolean;
  isPointerInside: boolean;
}

export const TrashZone = React.forwardRef<
  HTMLDivElement,
  TrashZoneProps
>(function TrashZone({ isActive, isPointerInside }, ref) {
  return (
    <div
      ref={ref}
      className={`trash-zone ${isActive ? 'trash-zone--active' : ''} ${
        isPointerInside ? 'trash-zone--hover' : ''
      }`}
      aria-label="Trash zone - drag a note here to delete"
    >
      <span className="trash-zone-icon">🗑</span>
      <span className="trash-zone-label">Drop here to delete</span>
    </div>
  );
});
