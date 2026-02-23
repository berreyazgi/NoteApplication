import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import mockData from '../data/mock-data.json';
import type { NestedSystem, Note, Folder } from '../data/types';

/**
 * Interface for a Todo item.
 */
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

/**
 * Interface for a Sticky Note.
 */
export interface StickyNote {
  id: string;
  title: string;
  content: string;
  color: string;
}

/**
 * Global state shape.
 */
interface AppState {
  todos: Todo[];
  notes: StickyNote[];
  explorerData: NestedSystem;
  activeNoteId: string | null;
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  updateTodoText: (id: string, text: string) => void;
  addNote: () => void;
  updateNote: (id: string, updates: Partial<StickyNote>) => void;
  deleteNote: (id: string) => void;
  togglePin: (id: string) => void;
  selectNote: (id: string | null) => void;
  updateExplorerNote: (id: string, content: string) => void;
  moveItem: (itemId: string, newParentId: string | null) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  selectedFolderId: string | null;
  setSelectedFolderId: (id: string | null) => void;
  addExplorerNote: (parentId: string) => void;
  deleteExplorerNote: (id: string) => void;
  renameExplorerNote: (id: string, newName: string) => void;
  addFolder: (parentId: string | null) => string;
}

const AppContext = createContext<AppState | undefined>(undefined);

const PASTEL_COLORS = [
  '#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA',
  '#FF9AA2', '#FFB3BA', '#FFFFD8', '#A0E7E5', '#B28DFF'
];

const getRandomPastel = () => PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)];

// Recursive helper to toggle pin state
const togglePinRecursive = (items: NestedSystem, id: string): NestedSystem => {
  return items.map(item => {
    if (item.id === id) {
      return { ...item, pinned: !item.pinned };
    }
    if (item.type === 'folder' && item.children) {
      return { ...item, children: togglePinRecursive(item.children, id) };
    }
    return item;
  });
};

// Recursive helper to update note content
const updateNoteRecursive = (items: NestedSystem, id: string, content: string): NestedSystem => {
  return items.map(item => {
    if (item.id === id && item.type === 'note') {
      return { ...item, content };
    }
    if (item.type === 'folder' && item.children) {
      return { ...item, children: updateNoteRecursive(item.children, id, content) };
    }
    return item;
  });
};

// Helper to initialize pinned state if missing
const initializePinned = (items: any[]): NestedSystem => {
  return items.map(item => ({
    ...item,
    pinned: item.pinned ?? true,
    children: item.children ? initializePinned(item.children) : undefined
  }));
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id || 'anonymous';

  // Helper to create user-specific storage keys
  const key = (base: string) => `${base}_${userId}`;

  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem(key('dashboard_todos'));
    return saved ? JSON.parse(saved) : [];
  });

  const [notes, setNotes] = useState<StickyNote[]>(() => {
    const saved = localStorage.getItem(key('dashboard_notes'));
    return saved ? JSON.parse(saved) : [];
  });

  const [explorerData, setExplorerData] = useState<NestedSystem>(() => {
    const saved = localStorage.getItem(key('dashboard_explorer'));
    return saved ? JSON.parse(saved) : initializePinned(mockData);
  });

  const [activeNoteId, setActiveNoteId] = useState<string | null>(() => {
    return localStorage.getItem(key('dashboard_active_note'));
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  // Re-initialize data when user changes
  useEffect(() => {
    const savedTodos = localStorage.getItem(key('dashboard_todos'));
    setTodos(savedTodos ? JSON.parse(savedTodos) : []);

    const savedNotes = localStorage.getItem(key('dashboard_notes'));
    setNotes(savedNotes ? JSON.parse(savedNotes) : []);

    const savedExplorer = localStorage.getItem(key('dashboard_explorer'));
    setExplorerData(savedExplorer ? JSON.parse(savedExplorer) : initializePinned(mockData));

    const savedActive = localStorage.getItem(key('dashboard_active_note'));
    setActiveNoteId(savedActive);

    setSelectedFolderId(null);
  }, [userId]);

  // Persistence
  useEffect(() => {
    localStorage.setItem(key('dashboard_todos'), JSON.stringify(todos));
  }, [todos, userId]);

  useEffect(() => {
    localStorage.setItem(key('dashboard_notes'), JSON.stringify(notes));
  }, [notes, userId]);

  useEffect(() => {
    localStorage.setItem(key('dashboard_explorer'), JSON.stringify(explorerData));
  }, [explorerData, userId]);

  useEffect(() => {
    if (activeNoteId) {
      localStorage.setItem(key('dashboard_active_note'), activeNoteId);
    } else {
      localStorage.removeItem(key('dashboard_active_note'));
    }
  }, [activeNoteId, userId]);

  // Actions
  const addTodo = (text: string) => {
    const newTodo: Todo = { id: crypto.randomUUID(), text, completed: false };
    setTodos(prev => [...prev, newTodo]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev: Todo[]) => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos((prev: Todo[]) => prev.filter(t => t.id !== id));
  };

  const updateTodoText = (id: string, text: string) => {
    setTodos((prev: Todo[]) => prev.map(t => t.id === id ? { ...t, text } : t));
  };

  const addNote = () => {
    const newNote: StickyNote = {
      id: crypto.randomUUID(),
      title: '',
      content: '',
      color: getRandomPastel()
    };
    setNotes(prev => [...prev, newNote]);
  };

  const updateNote = (id: string, updates: Partial<StickyNote>) => {
    setNotes((prev: StickyNote[]) => prev.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const deleteNote = (id: string) => {
    setNotes((prev: StickyNote[]) => prev.filter(n => n.id !== id));
  };

  const togglePin = (id: string) => {
    setExplorerData((prev: NestedSystem) => togglePinRecursive(prev, id));
  };

  const selectNote = (id: string | null) => {
    setActiveNoteId(id);
  };

  const updateExplorerNote = (id: string, content: string) => {
    setExplorerData((prev: NestedSystem) => updateNoteRecursive(prev, id, content));
  };

  const moveItem = (itemId: string, newParentId: string | null) => {
    setExplorerData(prev => {
      let itemToMove: Note | Folder | null = null;

      const findAndRemove = (items: NestedSystem): NestedSystem => {
        return items.filter(item => {
          if (item.id === itemId) {
            itemToMove = { ...item };
            return false;
          }
          if (item.type === 'folder' && item.children) {
            item.children = findAndRemove([...item.children]);
          }
          return true;
        });
      };

      const addToNewParent = (items: NestedSystem): NestedSystem => {
        if (!itemToMove) return items;

        if (newParentId === null) {
          const itemWithNewParent = { ...itemToMove, parentId: null, pinned: true } as (Note | Folder);
          return [...items, itemWithNewParent];
        }

        if (itemToMove && (itemToMove as any).type === 'folder') {
          return [...items, { ...itemToMove, parentId: null, pinned: true } as Folder];
        }

        return items.map(item => {
          if (item.id === newParentId && item.type === 'folder') {
            const newItem = { ...itemToMove!, parentId: newParentId } as (Note | Folder);
            return {
              ...item,
              children: [...(item.children || []), newItem]
            } as Folder;
          }
          if (item.type === 'folder' && item.children) {
            return { ...item, children: addToNewParent([...item.children]) } as Folder;
          }
          return item;
        });
      };

      const cleanedData = findAndRemove([...prev]);
      return addToNewParent(cleanedData);
    });
  };

  const addExplorerNote = (parentId: string) => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      name: 'New Note',
      type: 'note',
      parentId,
      content: '',
      pinned: false
    };

    const addRecursive = (items: NestedSystem): NestedSystem => {
      return items.map(item => {
        if (item.id === parentId && item.type === 'folder') {
          return {
            ...item,
            children: [...(item.children || []), newNote]
          } as Folder;
        }
        if (item.type === 'folder' && item.children) {
          return { ...item, children: addRecursive(item.children) } as Folder;
        }
        return item;
      });
    };

    setExplorerData(prev => addRecursive(prev));
  };

  const deleteExplorerNote = (id: string) => {
    const removeRecursive = (items: NestedSystem): NestedSystem => {
      return items.filter(item => {
        if (item.id === id) return false;
        if (item.type === 'folder' && item.children) {
          item.children = removeRecursive(item.children);
        }
        return true;
      });
    };
    setExplorerData(prev => removeRecursive(prev));
  };

  const renameExplorerNote = (id: string, newName: string) => {
    const renameRecursive = (items: NestedSystem): NestedSystem => {
      return items.map(item => {
        if (item.id === id) {
          return { ...item, name: newName };
        }
        if (item.type === 'folder' && item.children) {
          return { ...item, children: renameRecursive(item.children) } as Folder;
        }
        return item;
      });
    };
    setExplorerData(prev => renameRecursive(prev));
  };

  const addFolder = (): string => {
    const newId = crypto.randomUUID();
    const newFolder: Folder = {
      id: newId,
      name: 'Unnamed Folder',
      type: 'folder',
      parentId: null,
      children: [],
      pinned: true
    };

    setExplorerData(prev => [...prev, newFolder]);
    return newId;
  };

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  return (
    <AppContext.Provider value={{
      todos, notes, explorerData, activeNoteId, addTodo, toggleTodo, deleteTodo, updateTodoText,
      addNote, updateNote, deleteNote, togglePin, selectNote, updateExplorerNote, moveItem,
      isSidebarOpen, toggleSidebar, selectedFolderId, setSelectedFolderId,
      addExplorerNote, deleteExplorerNote, renameExplorerNote, addFolder
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
