import React from "react";
import "../css/app.css";
import { createRoot } from "react-dom/client";
import UploadPlaceForm from "./components/Upload_place_form_component";
function UploadPlace() {
    return (
        <div>
            <UploadPlaceForm/>
       </div>
    );
}
const container = document.getElementById("upload_place");
const root = createRoot(container);
root.render(<UploadPlace />);
