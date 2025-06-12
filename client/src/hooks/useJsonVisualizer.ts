import { useRef, useState } from "react";
import type { Node, Edge } from "../types";

const useJsonVisualizer = () => {
  const [jsonInput, setJsonInput] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [graph, setGraph] = useState<{ newNodes: Node[]; newEdges: Edge[] } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const lastJsonRef = useRef<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    let parsed;
    try {
      parsed = JSON.parse(jsonInput);
    } catch {
      setError("JSON inválido");
      setGraph(null);
      setLoading(false);
      return;
    }

    const currentJsonString = JSON.stringify(parsed);
    if (currentJsonString === lastJsonRef.current && graph) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/visualize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: currentJsonString,
      });
      if (!response.ok) throw new Error("API error");
      const data = await response.json();

      setGraph(data);
      lastJsonRef.current = currentJsonString;
    } catch {
      setError("Error al procesar el JSON");
    } finally {
      setLoading(false);
    }
  };

  return {
    jsonInput,
    setJsonInput,
    error,
    setError,
    graph,
    setGraph,
    loading,
    handleSubmit,
  };
}

export { useJsonVisualizer };