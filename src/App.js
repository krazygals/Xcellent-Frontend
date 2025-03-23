import React from "react";
import FileUpload from "./components/FileUpload";  // ✅ Import the FileUpload component

function App() {
  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h2>Xcellent File Upload</h2>  {/* Page Title */}
      <FileUpload />  {/* ✅ Use the FileUpload component here */}
    </div>
  );
}

export default App;
