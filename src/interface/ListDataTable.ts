export interface RowData {
  key: string;
  path: string;
  name: string;
  newName: string;
  state: "ok" | "conflict" | "error";
  isSelected?: boolean;
  [key: string]: unknown;
}
