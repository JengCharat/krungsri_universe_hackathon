import React from
"react"; import "../css/app.css";
import { createRoot } from "react-dom/client";
import MapComponent from "./components/map_component";
function MapPage() {
    return (
    <div>
            <MapComponent/>
            <h1 className="text-green-200">hello this is map page</h1>
    </div>
    );
}
const container = document.getElementById("map");
const root =createRoot(container); root.render(<MapPage />);
