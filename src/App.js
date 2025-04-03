import React from "react";
import FileUpload from "./components/FileUpload";
import PasteColumns from './components/PasteColumns';  // ✅ Already imported

function App() {
  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h2>Xcellent File Upload</h2>
      <FileUpload />
      <hr style={{ margin: '40px 0' }} />
      <PasteColumns />  {/* ✅ This now renders the paste input area */}
    </div>
  );
}

export default App;