import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import Navbar from './components/MyNavbar';
import Home from './components/Home';
import Clientes from './components/Clientes';
import { Visitas } from './components/Visitas';
import { Canjes } from './components/Canjes';
import { Plantas } from './components/Plantas';
import { Promociones } from './components/Promociones';
import Login from './components/Login';
import Registro from './components/Registro';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/visitas" element={<Visitas />} />
          <Route path="/canjes" element={<Canjes />} />
          <Route path="/plantas" element={<Plantas />} />
          <Route path="/promociones" element={<Promociones />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
