import React, { useState } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { Tooltip } from "react-tooltip";

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
  const [hovered, setHovered] = useState(false);

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
        boxShadow: hovered ? "0 4px 16px 0 #3b82f6aa" : "0 2px 8px 0 #0002",
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: hovered ? "#60a5fa" : "#3b82f6",
        fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
        wordBreak: "break-word",
        whiteSpace: "pre-line",
        fontSize: 14,
        fontWeight: 500,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        overflow: "hidden",
        backgroundColor: hovered ? "#232f3b" : "#23272f",
        transition: "box-shadow 0.2s, border-color 0.2s, background 0.2s",
      }}
      onClick={hasChildren ? () => data.onToggle(id) : undefined}
      aria-label={hasChildren ? (data.collapsed ? "Expandir" : "Colapsar") : undefined}
      data-tooltip-id={`tooltip-${id}`}
      data-tooltip-content={data.label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
      <Tooltip id={`tooltip-${id}`} place="top" />
    </div>
  );
};

export default CollapsibleNode;
