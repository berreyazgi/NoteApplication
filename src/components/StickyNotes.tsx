import React from 'react';
import { useApp } from '../context/StateContext';
import { Plus, Trash2 } from 'lucide-react';

const StickyNotes: React.FC = () => {
  const { notes, addNote, updateNote, deleteNote } = useApp();

  return (
    <div className="widget">
      <div className="flex justify-between items-center mb-8">
        <h2>Sticky Notes</h2>
        <button onClick={addNote} className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white p-3 rounded-2xl hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-500/20 active:scale-95">
          <Plus size={24} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 overflow-y-auto pr-2 custom-scrollbar">
        {notes.map(note => (
          <div
            key={note.id}
            className="group relative p-5 rounded-[1.5rem] min-h-[160px] transition-all hover:scale-[1.03] shadow-lg"
            style={{
              backgroundColor: note.color,
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
            }}
          >
            <button
              onClick={() => deleteNote(note.id)}
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-60 hover:!opacity-100 p-2 text-black transition-all"
            >
              <Trash2 size={18} />
            </button>
            <input
              className="w-full bg-transparent border-none font-bold text-lg mb-2 focus:outline-none placeholder:text-black/30 text-black/80"
              value={note.title}
              onChange={(e) => updateNote(note.id, { title: e.target.value })}
              placeholder="Topic..."
            />
            <textarea
              className="w-full bg-transparent border-none text-base resize-none focus:outline-none placeholder:text-black/30 text-black/70 leading-relaxed"
              value={note.content}
              onChange={(e) => updateNote(note.id, { content: e.target.value })}
              placeholder="Quick jot..."
              rows={4}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StickyNotes;
