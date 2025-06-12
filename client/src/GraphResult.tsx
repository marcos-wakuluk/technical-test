import React from "react";
import type { Node, Edge } from "./types";

interface Props {
  graph: { newNodes: Node[]; newEdges: Edge[] };
}

const GraphResult: React.FC<Props> = ({ graph }) => (
  <div className="bg-gray-800 p-4 rounded mt-4">
    <h2 className="font-semibold mb-2">Nodos:</h2>
    <pre className="text-xs overflow-x-auto mb-2">{JSON.stringify(graph.newNodes, null, 2)}</pre>
    <h2 className="font-semibold mb-2">Edges:</h2>
    <pre className="text-xs overflow-x-auto">{JSON.stringify(graph.newEdges, null, 2)}</pre>
  </div>
);

export default GraphResult;
