import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Database, Column, Row, DatabaseLayout } from '@/types/database';

interface DatabaseState {
  databases: Database[];
  activeDatabaseId: string | null;
  isCreateModalOpen: boolean;
  isAiDrawerOpen: boolean;
  searchQuery: string;

  // History stack for Undo/Redo
  past: Database[][];
  future: Database[][];

  // Actions
  setCreateModalOpen: (open: boolean) => void;
  setAiDrawerOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setActiveDatabase: (id: string | null) => void;

  undo: () => void;
  redo: () => void;

  createDatabase: (data: {
    name: string;
    description?: string;
    icon: string;
    color: string;
    layout: DatabaseLayout;
    initialColumns?: Partial<Column>[];
  }) => Database;


  updateDatabase: (id: string, updates: Partial<Database>) => void;
  deleteDatabase: (id: string) => void;
  togglePinDatabase: (id: string) => void;

  addColumn: (databaseId: string, column: Omit<Column, 'id'>) => void;
  deleteColumn: (databaseId: string, columnId: string) => void;
  updateColumn: (databaseId: string, columnId: string, updates: Partial<Column>) => void;

  addRow: (databaseId: string, initialValues?: Record<string, unknown>) => void;
  deleteRow: (databaseId: string, rowId: string) => void;
  updateCell: (databaseId: string, rowId: string, columnId: string, value: unknown) => void;
  toggleCheckboxCell: (databaseId: string, rowId: string, columnId: string) => void;
  
  autoStructureColumns: (databaseId: string, newColumns: Partial<Column>[]) => void;
  
  clearAllData: () => void;
}

// Convert column index to Excel column letters (0 -> A, 1 -> B, 25 -> Z)
function getExcelColumnLetter(index: number): string {
  let letter = '';
  while (index >= 0) {
    letter = String.fromCharCode((index % 26) + 65) + letter;
    index = Math.floor(index / 26) - 1;
  }
  return letter;
}

const createBlankColumns = (count: number): Column[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `col_${Date.now()}_${i}`,
    name: `Column ${getExcelColumnLetter(i)}`,
    type: 'text',
    width: 150,
  }));
};

export const useDatabaseStore = create<DatabaseState>()(
  persist(
    (set, get) => ({
      databases: [
        {
          id: 'db_blank_default',
          name: 'Untitled Spreadsheet',
          description: 'Blank personal routine spreadsheet workspace.',
          icon: 'Grid',
          color: '#3b82f6',
          layout: 'table',
          columns: createBlankColumns(5),
          rows: Array.from({ length: 15 }).map((_, i) => ({
            id: `row_init_${i}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            values: {}
          })),
          isPinned: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ],
      activeDatabaseId: 'db_blank_default',
      isCreateModalOpen: false,
      isAiDrawerOpen: false,
      searchQuery: '',
      past: [],
      future: [],

      setCreateModalOpen: (open) => set({ isCreateModalOpen: open }),
      setAiDrawerOpen: (open) => set({ isAiDrawerOpen: open }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setActiveDatabase: (id) => set({ activeDatabaseId: id }),

      undo: () => {
        const { past, databases, future } = get();
        if (past.length === 0) return;
        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);
        set({
          databases: previous,
          past: newPast,
          future: [databases, ...future],
        });
      },

      redo: () => {
        const { future, databases, past } = get();
        if (future.length === 0) return;
        const next = future[0];
        const newFuture = future.slice(1);
        set({
          databases: next,
          past: [...past, databases],
          future: newFuture,
        });
      },

      createDatabase: ({ name, description, icon, color, layout, initialColumns }) => {
        const currentDbs = get().databases;
        const id = `db_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const columns: Column[] = initialColumns && initialColumns.length > 0 
          ? initialColumns.map((col, i) => ({
              id: col.id || `col_${Date.now()}_${i}`,
              name: col.name || `Column ${getExcelColumnLetter(i)}`,
              type: col.type || 'text',
              width: col.width || 150,
              options: col.options || [],
            }))
          : createBlankColumns(5);

        // Start with 15 blank rows
        const rows: Row[] = Array.from({ length: 15 }).map((_, i) => ({
          id: `row_${Date.now()}_${i}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          values: {}
        }));

        const newDb: Database = {
          id,
          name,
          description,
          icon: icon || 'Spreadsheet',
          color: color || '#3b82f6',
          layout: layout || 'table',
          columns,
          rows,
          isPinned: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set({
          past: [...get().past, currentDbs],
          future: [],
          databases: [newDb, ...currentDbs],
          activeDatabaseId: id,
        });

        return newDb;
      },



      updateDatabase: (id, updates) => {
        const currentDbs = get().databases;
        set({
          past: [...get().past, currentDbs],
          future: [],
          databases: currentDbs.map((db) => 
            db.id === id ? { ...db, ...updates, updatedAt: new Date().toISOString() } : db
          )
        });
      },

      deleteDatabase: (id) => {
        const currentDbs = get().databases;
        const nextDbs = currentDbs.filter((db) => db.id !== id);
        set({
          past: [...get().past, currentDbs],
          future: [],
          databases: nextDbs,
          activeDatabaseId: get().activeDatabaseId === id 
            ? (nextDbs[0]?.id || null) 
            : get().activeDatabaseId,
        });
      },

      togglePinDatabase: (id) => set((state) => ({
        databases: state.databases.map((db) => 
          db.id === id ? { ...db, isPinned: !db.isPinned } : db
        )
      })),

      addColumn: (databaseId, column) => {
        const currentDbs = get().databases;
        set({
          past: [...get().past, currentDbs],
          future: [],
          databases: currentDbs.map((db) => {
            if (db.id !== databaseId) return db;
            const newCol: Column = {
              ...column,
              id: `col_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              width: column.width || 160
            };
            return {
              ...db,
              columns: [...db.columns, newCol],
              updatedAt: new Date().toISOString()
            };
          })
        });
      },

      deleteColumn: (databaseId, columnId) => {
        const currentDbs = get().databases;
        set({
          past: [...get().past, currentDbs],
          future: [],
          databases: currentDbs.map((db) => {
            if (db.id !== databaseId) return db;
            return {
              ...db,
              columns: db.columns.filter((c) => c.id !== columnId),
              rows: db.rows.map((row) => {
                const nextValues = { ...row.values };
                delete nextValues[columnId];
                return { ...row, values: nextValues };
              }),
              updatedAt: new Date().toISOString()
            };
          })
        });
      },

      updateColumn: (databaseId, columnId, updates) => set((state) => ({
        databases: state.databases.map((db) => {
          if (db.id !== databaseId) return db;
          return {
            ...db,
            columns: db.columns.map((c) => c.id === columnId ? { ...c, ...updates } : c),
            updatedAt: new Date().toISOString()
          };
        })
      })),

      addRow: (databaseId, initialValues = {}) => {
        const currentDbs = get().databases;
        set({
          past: [...get().past, currentDbs],
          future: [],
          databases: currentDbs.map((db) => {
            if (db.id !== databaseId) return db;
            const newRow: Row = {
              id: `row_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              values: initialValues
            };
            return {
              ...db,
              rows: [...db.rows, newRow],
              updatedAt: new Date().toISOString()
            };
          })
        });
      },

      deleteRow: (databaseId, rowId) => {
        const currentDbs = get().databases;
        set({
          past: [...get().past, currentDbs],
          future: [],
          databases: currentDbs.map((db) => {
            if (db.id !== databaseId) return db;
            return {
              ...db,
              rows: db.rows.filter((r) => r.id !== rowId),
              updatedAt: new Date().toISOString()
            };
          })
        });
      },

      updateCell: (databaseId, rowId, columnId, value) => {
        const currentDbs = get().databases;
        set({
          past: [...get().past, currentDbs],
          future: [],
          databases: currentDbs.map((db) => {
            if (db.id !== databaseId) return db;
            return {
              ...db,
              rows: db.rows.map((r) => {
                if (r.id !== rowId) return r;
                return {
                  ...r,
                  updatedAt: new Date().toISOString(),
                  values: {
                    ...r.values,
                    [columnId]: value
                  }
                };
              }),
              updatedAt: new Date().toISOString()
            };
          })
        });
      },

      toggleCheckboxCell: (databaseId, rowId, columnId) => {
        const currentDbs = get().databases;
        set({
          past: [...get().past, currentDbs],
          future: [],
          databases: currentDbs.map((db) => {
            if (db.id !== databaseId) return db;
            return {
              ...db,
              rows: db.rows.map((r) => {
                if (r.id !== rowId) return r;
                const currentVal = Boolean(r.values[columnId]);
                return {
                  ...r,
                  updatedAt: new Date().toISOString(),
                  values: {
                    ...r.values,
                    [columnId]: !currentVal
                  }
                };
              }),
              updatedAt: new Date().toISOString()
            };
          })
        });
      },

      autoStructureColumns: (databaseId, newColumns) => {
        const currentDbs = get().databases;
        set({
          past: [...get().past, currentDbs],
          future: [],
          databases: currentDbs.map((db) => {
            if (db.id !== databaseId) return db;
            return {
              ...db,
              columns: db.columns.map((col, idx) => {
                const newCol = newColumns[idx];
                if (newCol) {
                  return { ...col, ...newCol };
                }
                return col;
              }),
              updatedAt: new Date().toISOString()
            };
          })
        });
      },



      clearAllData: () => set({
        databases: [],
        activeDatabaseId: null,
        past: [],
        future: []
      })
    }),
    {
      name: 'ascend_blank_excel_v4',
    }
  )
);
