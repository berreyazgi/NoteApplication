import React, { useState } from 'react';
import SidebarItem from './SidebarItem';
import { useApp } from '../context/StateContext';
import { useAuth } from '../context/AuthContext';
import { Rocket, Plus, Orbit } from 'lucide-react';

const Sidebar: React.FC = () => {
  const { explorerData, isSidebarOpen, toggleSidebar, addFolder } = useApp();
  const { user } = useAuth();
  const [justCreatedId, setJustCreatedId] = useState<string | null>(null);

  const folders = explorerData.filter(item => item.type === 'folder');

  const handleAddFolder = () => {
    const newId = addFolder(null);
    setJustCreatedId(newId);
    setTimeout(() => setJustCreatedId(null), 1000);
  };

  return (
    <aside className={`sidebar ${!isSidebarOpen ? 'collapsed' : ''}`}>
      {/* Rocket toggle – top-right corner */}
      <button
        onClick={toggleSidebar}
        className="absolute top-5 right-5 z-10 text-white/25 hover:text-violet-400 transition-colors"
        title="Toggle Sidebar"
      >
        <Rocket size={20} />
      </button>

      {/* Brand Header */}
      <div className="px-6 pt-8 pb-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Orbit size={26} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight leading-tight">Note App</h1>
            <p className="text-[11px] font-bold text-violet-400 uppercase tracking-[0.2em]">Workspace</p>
          </div>
        </div>
      </div>


      <div className="sidebar-content flex-1">
        <button
          onClick={handleAddFolder}
          className="add-folder-btn text-base"
        >
          <Plus size={18} />
          NEW FOLDER
        </button>

        {folders.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            startEditing={item.id === justCreatedId}
          />
        ))}

        {folders.length === 0 && (
          <p className="px-6 py-4 text-sm text-white/20 italic">
            No pinned folders. Create one to get started.
          </p>
        )}
      </div>

      {/* User Info */}
      <div className="p-5 border-t border-white/5 mt-auto">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-base shrink-0 shadow-md shadow-violet-500/20">
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div className="min-w-0">
            <p className="text-white font-bold text-base truncate">{user?.name || 'User'}</p>
            <p className="text-white/30 text-xs truncate">{user?.email || ''}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
