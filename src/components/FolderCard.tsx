import React from 'react';
import { Folder as FolderIcon, Pin, FileText, GripVertical } from 'lucide-react';
import { useApp } from '../context/StateContext';
import { useDraggable } from '@dnd-kit/core';
import type { Folder, Note } from '../data/types';

interface FolderCardProps {
  item: Folder | Note;
}

const FolderCard: React.FC<FolderCardProps> = ({ item }) => {
  const { togglePin, selectNote } = useApp();
  const isFolder = item.type === 'folder';

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    disabled: isFolder,
    data: {
      type: 'note',
      item: item
    }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 1000,
    opacity: isDragging ? 0.5 : 1
  } : undefined;

  const itemCount = isFolder ? (item as Folder).children?.length || 0 : 0;

  const handleCardClick = () => {
    if (!isFolder) {
      selectNote(item.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`folder-card widget ${isDragging ? 'dragging' : ''}`}
      onClick={handleCardClick}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {!isFolder && (
            <div className="drag-handle" {...listeners} {...attributes} onClick={e => e.stopPropagation()}>
              <GripVertical size={18} color="var(--text-muted)" />
            </div>
          )}
          <div className="folder-card-icon">
            {isFolder ? (
              <FolderIcon size={40} color="#6366f1" fill="#6366f111" />
            ) : (
              <FileText size={40} color="#94a3b8" />
            )}
          </div>
        </div>
        <button
          className="btn-icon pin-action"
          onClick={(e) => {
            e.stopPropagation();
            togglePin(item.id);
          }}
          title="Pin to Sidebar"
        >
          <Pin size={18} />
        </button>
      </div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>{item.name}</h3>
      {isFolder && (
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </p>
      )}
      {!isFolder && (
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Note</p>
      )}
    </div>
  );
};

export default FolderCard;
