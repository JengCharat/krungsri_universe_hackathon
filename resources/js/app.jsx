import React from
"react"; import "../css/app.css";
import { createRoot } from "react-dom/client";

import Example from "./components/Example";
import Navbar from "./components/Navbar";
function App() {
    return (
<div>
  <Example />
</div>
);
}
const container = document.getElementById("app");
const root =createRoot(container); root.render(<App />);
