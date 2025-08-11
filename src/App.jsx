import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardView from "./pages/DashboardView";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<DashboardView />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
