import React from "react";
import { ReactFlowProvider } from "@xyflow/react";
import Flow from "./Flow"; // Import your Flow component
import ConditionalFlow from "./ConditionalFlow";
const App = () => {
  return (
    <ReactFlowProvider>
      <ConditionalFlow />
      <Flow />
    </ReactFlowProvider>
  );
};

export default App;
