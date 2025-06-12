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
      className="w-full h-40 p-2 rounded mb-2 bg-white text-gray-900 resize-none border-gray-300"
      placeholder="Paste your JSON here"
      value={jsonInput}
      onChange={(e) => setJsonInput(e.target.value)}
    />
    <button
      type="submit"
      className="bg-blue-500 text-white font-bold px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={loading || !jsonInput}
    >
      {loading ? "Processing..." : "Visualize"}
    </button>
  </form>
);
