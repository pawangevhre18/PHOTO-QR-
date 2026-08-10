import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Result from "./pages/Result";
import PhotoView from "./pages/PhotoView";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
         <Route path="/result" element={<Result />} />
          <Route path="/photo/:id" element={<PhotoView />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;