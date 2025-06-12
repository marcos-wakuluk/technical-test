import "./App.css";
import { JsonInputForm } from "./components/JsonInputForm";
import GraphResult from "./components/GraphResult";
import { useJsonVisualizer } from "./hooks/useJsonVisualizer";

function App() {
  const { jsonInput, setJsonInput, error, graph, loading, handleSubmit } = useJsonVisualizer();

  return (
    <div className="min-h-screen flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-4 text-slate-100">JSON Visualizer</h1>
      <JsonInputForm jsonInput={jsonInput} setJsonInput={setJsonInput} loading={loading} handleSubmit={handleSubmit} />
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <div className="w-full flex justify-center">
        {<GraphResult graph={graph || { newNodes: [], newEdges: [] }} />}
      </div>
    </div>
  );
}

export default App;
