import React, { useRef } from 'react';
import { useDragLayer, XYCoord } from 'react-dnd';

export const DragLayer = () => {
  const itemRef = useRef<HTMLDivElement>(null);
  const { item, itemType, isDragging, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    currentOffset: monitor.getClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging) return null;

  function getItemStyles(currentOffset: XYCoord | null): React.CSSProperties {
    if (!currentOffset || !itemRef.current) return {};

    const boundingBox = itemRef.current.getBoundingClientRect();
    const [x, y] = [
      boundingBox.width < 500 ? currentOffset.x - boundingBox.width / 2 : -1000,
      currentOffset.y - boundingBox.height / 2
    ];

    return {
      position: 'absolute',
      pointerEvents: 'none',
      zIndex: 200,
      left: x,
      top: y
    };
  }

  return (
    <div style={getItemStyles(currentOffset)} ref={itemRef}>
      {item.type}
    </div>
  );
};
