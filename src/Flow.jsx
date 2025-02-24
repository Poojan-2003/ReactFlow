import React, { useCallback, useState } from "react";
import {ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Controls, Background,useReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const initialNodes = [
  { id: "1", position: { x: 250, y: 0 }, data: { label: "Start Node" } },
];

const initialEdges = [];

const Flow = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const { getEdges, setNodes: updateNodes } = useReactFlow();

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  );

  const executeFlow = () => {
    console.log("executeflow");
    
    const processedNodes = {};
    const processNode = (nodeId, inputData = { value: 1 }) => {
      if (processedNodes[nodeId]) return; 
      processedNodes[nodeId] = true;

      const node = nodes.find((n) => n.id === nodeId);
      if (!node) return;

      const transformedData = node.data.transformer ? node.data.transformer(inputData) : inputData;
      console.log(`Executing ${node.data.label}:`, transformedData);

      const outgoingEdges = getEdges().filter((edge) => edge.source === nodeId);
      outgoingEdges.forEach((edge) => processNode(edge.target, transformedData));
    };

    processNode("1"); 
 };

  const addNode = () => {
    const newNode = {
      id: (nodes.length + 1).toString(),
      position: { x: 250, y:nodes.length * 100 },
      data: { label: `Node ${nodes.length + 1}`,transformer:(input)=>{
        console.log(`hello ${nodes.length}`);
      }},
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const addConditionNode = () => {
    const conditionNode = {
      id: (nodes.length + 1).toString(),
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: "Condition" },
      type: "default",
      style: {
        width: 100,
        height: 50,
        borderRadius: "10%",
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
    };
    setNodes((nds) => [...nds, conditionNode]);
  };

  return (
    <div style={{ width: "100vw", height: "90vh" }}>
      <button onClick={addNode} style={{ margin: 10, padding: 5 }}>
        Add Node
      </button>
      <button onClick={addConditionNode} style={{ margin: 10, padding: 5 }}>
        Add Condition
      </button>
      <button onClick={executeFlow} style={{ margin: 10, padding: 5 }}>
        Run Flow
      </button>
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default Flow;
