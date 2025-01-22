import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Clientes from './components/Clientes'
import { Visitas } from './components/Visitas';
import { Canjes } from './components/Canjes';


const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Clientes" element={<Clientes />} />
        <Route path="/Visitas" element={<Visitas />} />
        <Route path="/Canjes" element={<Canjes />} />        
      </Routes>
    </Router>
  );
};

export default App;
