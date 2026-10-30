// main.tsx — Entry point for the React webview UI
// This runs inside a VS Code Webview panel (like a mini browser).

import React from "react";
import ReactDOM from "react-dom/client";

function App() {
  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", color: "#cdd6f4" }}>
      <h1>ContextSwitch AI</h1>
      <p>Dashboard loading...</p>
    </div>
  );
}

const root = document.getElementById("root");
if (root) {
  ReactDOM.createRoot(root).render(<App />);
}
