import React, { useEffect, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  Handle,
  Position,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  Connection,
  OnNodesChange,
  OnEdgesChange
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

interface NodeData {
  label: string;
  inputValue?: string;
  result?: string;
}

interface InputNodeProps {
  id: string;
  data: NodeData;
  onChange: (id: string, value: string) => void;
}

const InputNode: React.FC<InputNodeProps> = ({ id, data, onChange }) => {
  return (
    <div style={{ padding: 10, border: "2px solid black", borderRadius: 5, textAlign: "center" }}>
      {data.label}
      <input
        type="number"
        value={data.inputValue || ""}
        onChange={(e) => onChange(id, e.target.value)}
        placeholder="Enter number"
        style={{ width: "80%", marginTop: 5 }}
      />
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

const ConditionalNode: React.FC<{ data: NodeData }> = ({ data }) => {
  return (
    <div
      style={{
        padding: 10,
        border: "2px solid black",
        width: 80,
        height: 80,
        transform: "rotate(45deg)",
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ transform: "rotate(-45deg)" }}>{data.label}</div>
      <Handle type="target" position={Position.Top} style={{ left: "50%" }} />
      <Handle type="source" position={Position.Left} style={{ top: "50%" }} />
      <Handle type="source" position={Position.Right} style={{ top: "50%" }} />
    </div>
  );
};

const ProcessNode: React.FC<{ data: NodeData }> = ({ data }) => {
  return (
    <div style={{ padding: 10, border: "2px solid black", borderRadius: 5, textAlign: "center" }}>
      <p>Result: {data.result}</p>
      <Handle type="target" position={Position.Top} />
    </div>
  );
};

const initialNodes: Node[] = [
  { id: "1", position: { x: 250, y: 50 }, data: { label: "Start" }, type: "default" },
  { id: "2", position: { x: 250, y: 150 }, data: { label: "Enter Number", inputValue: "" }, type: "inputNode" },
  { id: "3", position: { x: 200, y: 350 }, data: { label: "Multiply by 2", result: "" }, type: "processNode" },
  { id: "4", position: { x: 400, y: 350 }, data: { label: "Multiply by 3", result: "" }, type: "processNode" },
  { id: "5", position: { x: 300, y: 250 }, data: { label: "Check Even/Odd" }, type: "conditionalNode" },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-5", source: "2", target: "5" },
  { id: "e5-3", source: "5", target: "3", label: "Even" },
  { id: "e5-4", source: "5", target: "4", label: "Odd" }
];

const LOCAL_STORAGE_KEY = "savedFlow";

const ConditionalFlow: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  useEffect(() => {
    const savedFlow = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedFlow) {
      const { nodes, edges } = JSON.parse(savedFlow);
      setNodes(nodes);
      setEdges(edges);
    }
  }, []);

  const saveFlow = () => {
    const flow = JSON.stringify({ nodes, edges });
    localStorage.setItem(LOCAL_STORAGE_KEY, flow);
  };

  const updateNodeInput = (id: string, value: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, inputValue: value } } : node
      )
    );
  };

  const executeFlow = () => {
    const node2 = nodes.find((n) => n.id === "2");
    if (!node2) return;
    
    const num = Number(node2.data.inputValue);
    if (isNaN(num)) return alert("Enter a valid number!");

    const isEven = num % 2 === 0;
    console.log(`Number: ${num}, Even: ${isEven}`);

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === "3" && isEven) return { ...node, data: { ...node.data, result: `Even: ${num * 2}` } };
        if (node.id === "4" && !isEven) return { ...node, data: { ...node.data, result: `Odd: ${num * 3}` } };
        return node;
      })
    );
  };

  return (
    <div style={{ width: "100vw", height: "90vh" }}>
      <button onClick={executeFlow} style={{ margin: 10, padding: 5 }}>
        Run Flow
      </button>
      <button onClick={saveFlow} style={{ margin: 5, padding: 5 }}>
        Save Flow
      </button>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={(changes) => setNodes((nds) => applyNodeChanges(changes, nds))}
          onEdgesChange={(changes) => setEdges((eds) => applyEdgeChanges(changes, eds))}
          onConnect={(connection: Connection) => setEdges((eds) => addEdge(connection, eds))}
          nodeTypes={{
            inputNode: (props) => <InputNode {...props} onChange={updateNodeInput} />,
            conditionalNode: ConditionalNode,
            processNode: ProcessNode,
          }}
          fitView
        />
      </ReactFlowProvider>
    </div>
  );
};

export default ConditionalFlow;
