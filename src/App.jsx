import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Pages/Home";
import PhotoView from "./Pages/Photoview";
import Result from "./Pages/Result";
import Upload from "./Pages/Upload";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/photo/:id" element={<PhotoView />} />
        <Route path="/result" element={<Result />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;