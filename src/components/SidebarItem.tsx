import React, { useState } from 'react';
import { Folder as FolderIcon, ChevronRight, ChevronDown, FileText } from 'lucide-react';
import type { Folder, Note } from '../data/types';
import { useApp } from '../context/StateContext';
import { useDroppable } from '@dnd-kit/core';

interface SidebarItemProps {
  item: Folder | Note;
  startEditing?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ item, startEditing = false }) => {
  const [isEditing, setIsEditing] = useState(startEditing);
  const [newName, setNewName] = useState(item.name);
  const [isExpanded, setIsExpanded] = useState(false);
  const { selectNote, setSelectedFolderId, renameExplorerNote } = useApp();
  const isFolder = item.type === 'folder';

  const { isOver, setNodeRef } = useDroppable({
    id: item.id,
    disabled: !isFolder,
    data: {
      type: 'folder',
      item: item
    }
  });

  const childNotes: Note[] = isFolder && (item as Folder).children
    ? ((item as Folder).children || []).filter(c => c.type === 'note') as Note[]
    : [];

  const handleClick = () => {
    if (isEditing) return;
    setSelectedFolderId(item.id);
    selectNote(null);
    setIsExpanded(prev => !prev);
  };

  const handleNoteClick = (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation();
    selectNote(noteId);
  };

  const handleRename = () => {
    if (newName.trim()) {
      renameExplorerNote(item.id, newName);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleRename();
    if (e.key === 'Escape') {
      setNewName(item.name);
      setIsEditing(false);
    }
  };

  return (
    <div className="sidebar-item-container" ref={setNodeRef}>
      {/* Folder Row */}
      <div
        className={`flex items-center gap-3 px-5 py-3.5 cursor-pointer transition-all rounded-lg mx-2 ${isOver ? 'bg-violet-500/10 border-l-2 border-violet-500' : 'hover:bg-white/[0.03]'}`}
        onClick={handleClick}
        onDoubleClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
      >
        {/* Chevron */}
        <span className="text-white/20 shrink-0 w-5 flex justify-center">
          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </span>

        {/* Folder icon */}
        <FolderIcon size={20} className="shrink-0" color={isOver ? 'var(--primary)' : '#7B6CF6'} />

        {/* Name or rename input */}
        {isEditing ? (
          <input
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(123,108,246,0.2)', borderRadius: '8px', padding: '6px 10px', color: 'white', outline: 'none', width: '100%', fontSize: '1rem' }}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={handleKeyDown}
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="flex-grow text-base font-semibold text-white/70 truncate" style={{
            color: isOver ? 'var(--primary)' : undefined
          }}>
            {item.name}
          </span>
        )}

        {/* Note count */}
        {childNotes.length > 0 && !isEditing && (
          <span className="text-[11px] font-bold text-white/20 bg-white/5 px-2.5 py-1 rounded-full shrink-0">
            {childNotes.length}
          </span>
        )}
      </div>

      {/* Expanded Notes – indented to align with folder name */}
      {isExpanded && (
        <div className="mt-1 mb-2" style={{ marginLeft: '52px' }}>
          {childNotes.length > 0 ? (
            <div className="border-l border-white/5 pl-4 space-y-1">
              {childNotes.map(note => (
                <div
                  key={note.id}
                  onClick={(e) => handleNoteClick(e, note.id)}
                  className="flex items-center gap-3 px-3 py-2.5 cursor-pointer text-white/40 hover:text-white/80 hover:bg-violet-500/5 transition-all rounded-lg group"
                >
                  <FileText size={16} className="shrink-0 text-violet-400/40 group-hover:text-violet-400/70" />
                  <span className="text-[15px] font-medium truncate">{note.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-white/15 italic pl-4 py-2">No notes yet</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SidebarItem;
