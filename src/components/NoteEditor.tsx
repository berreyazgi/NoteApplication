import React, { useMemo } from 'react';
import { useApp } from '../context/StateContext';
import { ArrowLeft } from 'lucide-react';
import type { NestedSystem, Note } from '../data/types';

const NoteEditor: React.FC = () => {
  const { activeNoteId, explorerData, selectNote, updateExplorerNote, renameExplorerNote } = useApp();

  const findNote = (items: NestedSystem, id: string): Note | null => {
    for (const item of items) {
      if (item.id === id && item.type === 'note') return item;
      if (item.type === 'folder' && item.children) {
        const found = findNote(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const activeNote = useMemo(() => {
    if (!activeNoteId) return null;
    return findNote(explorerData, activeNoteId);
  }, [activeNoteId, explorerData]);

  if (!activeNoteId) return null;

  if (!activeNote) {
    return (
      <div className="editor-container">
        <div className="editor-card items-center justify-center text-center">
          <p className="text-xl text-white/40 mb-6 font-medium italic">Note vanished into the void...</p>
          <button onClick={() => selectNote(null)} className="back-btn-modern flex items-center gap-2">
            <ArrowLeft size={18} />
            <span>Return to Base</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="editor-container">
      <div className="editor-card">
        <header className="flex justify-between items-center mb-12">
          <button onClick={() => selectNote(null)} className="back-btn-modern flex items-center gap-2 hover:bg-violet-500/10 transition-all active:scale-95">
            <ArrowLeft size={20} />
            <span className="font-bold">Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-2 text-xs font-bold text-violet-400 bg-violet-500/10 px-4 py-2 rounded-full uppercase tracking-widest border border-violet-500/15">
            <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse shadow-[0_0_6px_rgba(123,108,246,0.6)]"></div>
            Changes Saved Local
          </div>
        </header>

        <div className="flex flex-col flex-grow">
          <input
            className="editor-title-expansive"
            value={activeNote.name}
            onChange={(e) => renameExplorerNote(activeNote.id, e.target.value)}
            placeholder="Untitled Note"
          />

          <textarea
            className="rich-editor-expansive"
            value={activeNote.content}
            onChange={(e) => updateExplorerNote(activeNote.id, e.target.value)}
            placeholder="Start writing something extraordinary..."
            spellCheck={false}
          />
        </div>

        <footer className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center text-xs font-bold text-white/20 uppercase tracking-[0.2em]">
          <div className="flex gap-6">
            <span>{activeNote.content.length} characters</span>
            <span>{activeNote.content.split(/\s+/).filter(Boolean).length} words</span>
          </div>
          <span className="text-violet-400/50">Zen Mode Active</span>
        </footer>
      </div>
    </div>
  );
};

export default NoteEditor;
