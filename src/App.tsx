import React, { useState } from 'react';
import { useApp } from './context/StateContext';
import { useAuth } from './context/AuthContext';
import type { NestedSystem, Note } from './data/types';
import Calendar from './components/Calendar';
import StickyNotes from './components/StickyNotes';
import TodoList from './components/TodoList';
import Sidebar from './components/Sidebar';
import NoteEditor from './components/NoteEditor';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { Rocket, Trash2, Edit3, Plus, Check, X, ArrowLeft } from 'lucide-react';
import './index.css';

const NoteCard: React.FC<{ note: Note }> = ({ note }) => {
  const { deleteExplorerNote, renameExplorerNote, selectNote } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(note.name);

  const handleRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (newName.trim()) {
      renameExplorerNote(note.id, newName);
      setIsEditing(false);
    }
  };

  return (
    <div
      className="widget transition-all relative group flex flex-col cursor-pointer"
      onClick={() => selectNote(note.id)}
    >
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-4 flex-grow">
          <div className="w-2 h-8 bg-indigo-500 rounded-full"></div>
          {isEditing ? (
            <div className="flex items-center gap-1 w-full" onClick={e => e.stopPropagation()}>
              <input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-base w-full outline-none focus:border-violet-500"
                autoFocus
                onKeyDown={e => e.key === 'Enter' && handleRename(e as any)}
              />
              <button onClick={handleRename} className="text-emerald-400 hover:text-emerald-300 p-2"><Check size={20} /></button>
              <button onClick={(e) => { e.stopPropagation(); setIsEditing(false); }} className="text-rose-400 hover:text-rose-300 p-2"><X size={20} /></button>
            </div>
          ) : (
            <h3 className="font-bold text-white text-2xl tracking-tight truncate">{note.name}</h3>
          )}
        </div>

        {!isEditing && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
              className="p-2 text-white/30 hover:text-violet-400 hover:bg-violet-500/10 rounded-xl transition-colors"
            >
              <Edit3 size={20} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); window.confirm('Delete this note?') && deleteExplorerNote(note.id); }}
              className="p-2 text-white/30 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
            >
              <Trash2 size={20} />
            </button>
          </div>
        )}
      </div>
      <p className="text-white/50 text-lg line-clamp-[10] flex-grow overflow-hidden leading-relaxed">
        {note.content || "Empty note content... Click to start writing."}
      </p>
    </div>
  );
};

const DashboardContent: React.FC = () => {
  const { explorerData, selectedFolderId, setSelectedFolderId, addExplorerNote } = useApp();
  const { user, logout } = useAuth();

  const findFolderNotes = (items: NestedSystem, id: string | null): Note[] => {
    if (!id) return [];
    for (const item of items) {
      if (item.id === id && item.type === 'folder') {
        return (item.children || []).filter(child => child.type === 'note') as Note[];
      }
      if (item.type === 'folder' && item.children) {
        const found = findFolderNotes(item.children, id);
        if (found.length > 0) return found;
      }
    }
    return [];
  };

  const findFolderName = (items: NestedSystem, id: string | null): string => {
    if (!id) return '';
    for (const item of items) {
      if (item.id === id) return item.name;
      if (item.type === 'folder' && item.children) {
        const name = findFolderName(item.children, id);
        if (name) return name;
      }
    }
    return '';
  };

  const selectedFolderNotes = findFolderNotes(explorerData, selectedFolderId);
  const selectedFolderName = findFolderName(explorerData, selectedFolderId);

  return (
    <div className="flex flex-col min-h-full">
      <header className="p-20 pb-12 text-center relative flex flex-col items-center">
        {/* Log Out – top-right */}
        <button
          onClick={logout}
          className="absolute top-8 right-8 px-7 py-3 rounded-xl border border-white/10 text-white/40 text-base font-bold hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/5 hover:shadow-[0_0_20px_rgba(248,113,113,0.1)] transition-all active:scale-95"
        >
          Log Out
        </button>

        <div className="w-full h-12" />

        <h1 className="text-6xl font-black text-white tracking-tighter mb-3">
          {selectedFolderId ? selectedFolderName.toUpperCase() : `HI, ${(user?.name || 'FRIEND').toUpperCase()}!`}
        </h1>
        <p className="text-violet-400 font-bold uppercase tracking-[0.3em] text-[12px] opacity-70 mb-10">
          {selectedFolderId ? `Let's manage your thoughts here.` : 'Ready to organize your world today?'}
        </p>

        {selectedFolderId && (
          <div className="flex flex-col sm:flex-row gap-6 mt-4">
            <button
              onClick={() => setSelectedFolderId(null)}
              className="group relative flex items-center gap-6 bg-white/5 backdrop-blur-lg text-white px-16 py-8 rounded-[2rem] text-xl font-black transition-all hover:scale-[1.03] active:scale-95 shadow-[0_20px_60px_rgba(0,0,0,0.2)] hover:shadow-[0_30px_80px_rgba(0,0,0,0.3)] border border-white/10"
            >
              <div className="bg-white/10 text-white/50 rounded-xl p-3 group-hover:bg-violet-500/20 group-hover:text-violet-400 transition-colors">
                <ArrowLeft size={32} />
              </div>
              RETURN MAIN PAGE
            </button>

            <button
              onClick={() => addExplorerNote(selectedFolderId)}
              className="group relative flex items-center gap-6 bg-gradient-to-br from-violet-600 to-indigo-600 text-white px-20 py-10 rounded-[2rem] text-xl font-black transition-all hover:scale-[1.03] active:scale-95 shadow-[0_20px_60px_rgba(123,108,246,0.3)] hover:shadow-[0_30px_80px_rgba(123,108,246,0.4)]"
            >
              <div className="bg-white/20 text-white rounded-xl p-3 group-hover:bg-white/30 transition-colors">
                <Plus size={32} />
              </div>
              ADD NEW NOTE
            </button>
          </div>
        )}
      </header>

      {selectedFolderId && (
        <section className="px-6 md:px-16 py-10">
          {selectedFolderNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-10 lg:gap-12">
              {selectedFolderNotes.map(note => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          ) : (
            <div className="text-center py-32 border-2 border-dashed border-white/5 rounded-[2rem] bg-white/[0.02]">
              <p className="text-white/30 font-medium italic text-lg">Empty folder. Time to start a new journey?</p>
            </div>
          )}
        </section>
      )}

      {/* Main Blocks (Home View Only) */}
      {!selectedFolderId && (
        <main className="dashboard-container">
          <div className="xl:col-span-2">
            <Calendar />
          </div>

          <div className="xl:col-span-1">
            <TodoList />
          </div>

          <div className="xl:col-span-1">
            <StickyNotes />
          </div>
        </main>
      )}
    </div>
  );
};

const DashboardApp: React.FC = () => {
  const { activeNoteId, moveItem, isSidebarOpen, toggleSidebar } = useApp();

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeId = active.id as string;
      const overId = over.id as string;

      if (active.data.current?.type === 'note' && over.data.current?.type === 'folder') {
        moveItem(activeId, overId);
      }
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="app-layout">
        <Sidebar />
        {!isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="sidebar-toggle"
            title="Open Sidebar"
          >
            <Rocket size={24} />
          </button>
        )}
        <div className={`main-content transition-all duration-300 ${!isSidebarOpen ? 'pl-0' : ''}`}>
          {activeNoteId ? <NoteEditor /> : <DashboardContent />}
        </div>
      </div>
    </DndContext>
  );
};

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [authPage, setAuthPage] = useState<'login' | 'signup'>('login');

  if (!isAuthenticated) {
    return authPage === 'login'
      ? <Login onSwitchToSignup={() => setAuthPage('signup')} />
      : <SignUp onSwitchToLogin={() => setAuthPage('login')} />;
  }

  return <DashboardApp />;
};

export default App;
