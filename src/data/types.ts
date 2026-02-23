/**
 * Base interface for all items in the system.
 */
export interface BaseItem {
  id: string;
  name: string;
  parentId: string | null;
  pinned: boolean;
}

/**
 * Represents a single note.
 */
export interface Note extends BaseItem {
  type: 'note';
  content: string;
}

/**
 * Represents a folder which can contain notes or other folders.
 */
export interface Folder extends BaseItem {
  type: 'folder';
  children: (Note | Folder)[];
}

/**
 * Root structure for the nested note system.
 */
export type NestedSystem = (Note | Folder)[];
