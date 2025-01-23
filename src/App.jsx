import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/MyNavbar';
import Home from './components/Home';
import Clientes from './components/Clientes'
import { Visitas } from './components/Visitas';
import { Canjes } from './components/Canjes';
import { Plantas } from './components/Plantas';


const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Clientes" element={<Clientes />} />
        <Route path="/Visitas" element={<Visitas />} />
        <Route path="/Canjes" element={<Canjes />} />   
        <Route path="/Plantas" element={<Plantas />} />       
      </Routes>
    </Router>
  );
};

export default App;
