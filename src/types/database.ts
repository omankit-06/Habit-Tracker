export type ColumnType = 
  | 'text'
  | 'checkbox'
  | 'number'
  | 'date'
  | 'time'
  | 'select'
  | 'multi_select'
  | 'status'
  | 'progress'
  | 'tag'
  | 'rating'
  | 'color'
  | 'url'
  | 'notes'
  | 'email'
  | 'phone';

export type DatabaseLayout = 'table' | 'grid' | 'timeline' | 'calendar' | 'kanban';

export interface SelectOption {
  id: string;
  label: string;
  color?: string;
}

export interface Column {
  id: string;
  name: string;
  type: ColumnType;
  width?: number;
  options?: SelectOption[];
  required?: boolean;
}

export interface CellStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  align?: 'left' | 'center' | 'right';
  bgColor?: string;
  textColor?: string;
}

export interface Row {
  id: string;
  createdAt: string;
  updatedAt: string;
  values: Record<string, unknown>;
  styles?: Record<string, CellStyle>;
}

export interface Sheet {
  id: string;
  name: string;
  columns: Column[];
  rows: Row[];
}

export interface ActiveCell {
  rowIndex: number;
  colIndex: number;
  rowId: string;
  columnId: string;
}

export interface SelectionRange {
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
}

export interface Database {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  layout: DatabaseLayout;
  columns: Column[];
  rows: Row[];
  sheets?: Sheet[];
  activeSheetId?: string;
  isPinned?: boolean;
  createdAt: string;
  updatedAt: string;
}
