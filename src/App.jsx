import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Clientes from './components/Clientes'
import { Visitas } from './components/Visitas';


const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Clientes" element={<Clientes />} />
        <Route path="/Visitas" element={<Visitas />} />
      </Routes>
    </Router>
  );
};

export default App;
