export interface Node {
  id: string;
  data: { label: string };
  position: { x: number; y: number };
  style: { width: number; padding: string; textAlign: string; backgroundColor?: string };
}

export interface Edge {
  id: string;
  source: string;
  target: string;
}