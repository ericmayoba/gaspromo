import '/src/Styles/Navbar.css'; 
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/clientes">Clientes</Link></li>
        <li><Link to="/visitas">Visitas</Link></li>
        <li><Link to="/canjes">Canjes</Link></li>
        <li><a onClick={() => alert('Salir')}>Salir</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
