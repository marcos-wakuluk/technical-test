import React, { useCallback, useMemo, useState } from "react";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";
import CollapsibleNode from "./CollapsibleNode";
import type { Node, Edge } from "../types";

function cleanLabel(label: string): string {
  let cleaned = label;
  if (cleaned.includes("=")) {
    cleaned = cleaned.split("=").pop()!;
  }
  if (cleaned.endsWith("-value")) {
    cleaned = cleaned.replace("-value", "");
  }
  if (cleaned.endsWith("-")) {
    cleaned = cleaned.slice(0, -1);
  }
  if (cleaned.includes("/")) {
    cleaned = cleaned.split("/").pop()!;
  }
  if (cleaned.includes(".")) {
    cleaned = cleaned.split(".").pop()!;
  }
  cleaned = cleaned.replace(/\[\d+\]/g, "");
  return cleaned.trim();
}

interface Props {
  graph: { newNodes: Node[]; newEdges: Edge[] };
}

const getChildren = (edges: Edge[], nodeId: string) => edges.filter((e) => e.source === nodeId).map((e) => e.target);
const getParent = (edges: Edge[], nodeId: string) => {
  const edge = edges.find((e) => e.target === nodeId);
  return edge ? edge.source : null;
};

const nodeTypes = { collapsible: CollapsibleNode };

const GraphResult: React.FC<Props> = ({ graph }) => {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const handleToggle = useCallback((id: string) => {
    setCollapsed((c) => ({ ...c, [id]: !c[id] }));
  }, []);

  const { visibleNodes, visibleEdges } = useMemo(() => {
    const hiddenNodes = new Set<string>();
    const hideRecursive = (id: string) => {
      const children = getChildren(graph.newEdges, id);
      for (const child of children) {
        hiddenNodes.add(child);
        hideRecursive(child);
      }
    };
    Object.entries(collapsed).forEach(([id, isCollapsed]) => {
      if (isCollapsed) hideRecursive(id);
    });

    const nodeMap = Object.fromEntries(graph.newNodes.map((n) => [n.id, n]));
    const nodesToFilter = new Set(
      graph.newNodes
        .filter((n) => {
          const parentId = getParent(graph.newEdges, n.id);
          if (!parentId) return false;
          const parentNode = nodeMap[parentId];
          if (!parentNode) return false;
          const label = cleanLabel(n.data.label);
          const parentLabel = cleanLabel(parentNode.data.label);
          const isArrayElement = /\[\d+\]$/.test(n.id);
          if (isArrayElement) {
            return false;
          }
          if (n.id.endsWith("-value")) return false;
          const children = getChildren(graph.newEdges, n.id);
          const hasArrayChild = children.some((childId) => /\[\d+\]$/.test(childId));
          if (hasArrayChild) return false;
          return label === parentLabel;
        })
        .map((n) => n.id)
    );

    let rewiredEdges = graph.newEdges.slice();
    nodesToFilter.forEach((filteredId) => {
      const parentId = getParent(graph.newEdges, filteredId);
      if (!parentId) return;
      const children = getChildren(graph.newEdges, filteredId);
      rewiredEdges = rewiredEdges.filter((e) => e.source !== filteredId && e.target !== filteredId);
      children.forEach((childId) => {
        rewiredEdges.push({
          id: `e-${parentId}-${childId}`,
          source: parentId,
          target: childId,
        });
      });
    });

    const filteredNodes = graph.newNodes.filter((n) => !nodesToFilter.has(n.id) && !hiddenNodes.has(n.id));

    const visibleNodes = filteredNodes.map((n) => ({
      id: n.id,
      data: {
        label: n.data.label,
        collapsed: !!collapsed[n.id],
        onToggle: handleToggle,
      },
      position: n.position,
      style: {
        ...n.style,
        textAlign: n.style.textAlign as "left" | "right" | "center" | "justify" | undefined,
        backgroundColor: undefined,
      },
      type: "collapsible",
      edges: rewiredEdges,
    }));

    const visibleEdges = rewiredEdges
      .filter((e) => !hiddenNodes.has(e.source) && !hiddenNodes.has(e.target))
      .map((e) => ({
        ...e,
        animated: true,
        style: { stroke: "#888" },
      }));

    return { visibleNodes, visibleEdges };
  }, [graph, collapsed, handleToggle]);

  return (
    <div
      className="bg-gray-900 p-4 rounded-xl mt-4 shadow-lg border border-gray-700 flex flex-col items-center justify-center mx-auto"
      style={{ height: 600, minHeight: 400, width: "80vw", maxWidth: "1200px" }}
    >
      <div className="flex-1 w-full rounded overflow-hidden bg-gray-800 flex items-center justify-center">
        <ReactFlow nodes={visibleNodes} edges={visibleEdges} fitView nodeTypes={nodeTypes}>
          <MiniMap />
          <Controls />
          <Background gap={10} />
        </ReactFlow>
      </div>
    </div>
  );
};

export default GraphResult;
