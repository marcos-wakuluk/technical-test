import React from "react";
import { Handle, NodeProps, Position } from "reactflow";

interface CollapsibleNodeProps extends NodeProps {
  data: {
    label: string;
    collapsed: boolean;
    onToggle: (id: string) => void;
  };
  edges?: Array<{ source: string }>;
}

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

function getArrayIndexLabel(label: string): string | null {
  const match = label.match(/^(.*)\[(\d+)\]$/);
  if (match) {
    return `${cleanLabel(match[1])} ${parseInt(match[2], 10) + 1}`;
  }
  return null;
}

const CollapsibleNode: React.FC<CollapsibleNodeProps> = ({ id, data, isConnectable, edges }) => {
  let hasChildren = false;
  if (edges && Array.isArray(edges)) {
    hasChildren = edges.some((e: { source: string }) => e.source === id);
  } else {
    hasChildren = !data.label.endsWith("-value");
  }

  const displayLabel = getArrayIndexLabel(data.label) || cleanLabel(data.label);

  return (
    <div
      style={{
        background: "#23272f",
        color: "#fff",
        padding: 12,
        borderRadius: 8,
        minWidth: 120,
        maxWidth: 260,
        cursor: hasChildren ? "pointer" : "default",
        boxShadow: "0 2px 8px 0 #0002",
        border: "2px solid #3b82f6",
        fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
        wordBreak: "break-word",
        whiteSpace: "pre-line",
        fontSize: 14,
        fontWeight: 500,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        overflow: "hidden",
        backgroundColor: "#23272f",
      }}
      onClick={hasChildren ? () => data.onToggle(id) : undefined}
      aria-label={hasChildren ? (data.collapsed ? "Expandir" : "Colapsar") : undefined}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span style={{ flex: 1, overflowWrap: "break-word", textAlign: "left" }}>{displayLabel}</span>
        {hasChildren && (
          <span style={{ marginLeft: 8, fontWeight: "bold", fontSize: 18, color: "#60a5fa" }}>
            {data.collapsed ? "+" : "-"}
          </span>
        )}
      </div>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
};

export default CollapsibleNode;
