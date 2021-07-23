
export interface PrInfo {
  id: number;
  name: string;
  state: "OPEN" | "MERGED" | "CLOSED";
  url: string;
}