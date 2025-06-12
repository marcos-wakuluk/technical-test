import React from "react";

interface Props {
  jsonInput: string;
  setJsonInput: (v: string) => void;
  loading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}

export const JsonInputForm: React.FC<Props> = ({ jsonInput, setJsonInput, loading, handleSubmit }) => (
  <form onSubmit={handleSubmit} className="mb-4">
    <textarea
      className="w-full h-40 p-2 border rounded mb-2 text-black"
      placeholder="Pega tu JSON aquí"
      value={jsonInput}
      onChange={(e) => setJsonInput(e.target.value)}
    />
    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={loading}>
      {loading ? "Procesando..." : "Visualizar"}
    </button>
  </form>
);
