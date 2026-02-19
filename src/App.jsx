import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Builder from './pages/Builder/Builder.jsx';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/builder" element={<Builder />} />
        
        <Route path="*" element={<h1>404 - Page non trouvée</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;