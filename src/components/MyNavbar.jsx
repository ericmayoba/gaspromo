import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const MyNavbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar collapseOnSelect expand="lg" bg="success" data-bs-theme="dark">
      <Container>
      <Navbar.Brand href="/">
          <img
            src={logo}
            alt="Logo"
            width="40" 
            height="40"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {isAuthenticated ? (
              <>
                <Nav.Link href="/clientes">Clientes</Nav.Link>
                <Nav.Link href="/visitas">Visitas</Nav.Link>
                <Nav.Link href="/canjes">Canjes</Nav.Link>
                <NavDropdown title="Admin" id="collapsible-nav-dropdown">
                  <NavDropdown.Item href="/plantas">Plantas</NavDropdown.Item>
                  <NavDropdown.Item href="/promociones">Promociones</NavDropdown.Item>
                  <NavDropdown.Divider />
                </NavDropdown>
              </>
            ) : (
              <Nav.Link href="/login">Login</Nav.Link>
            )}
          </Nav>
          {isAuthenticated && (
            <Nav>
              <Nav.Link onClick={handleLogout} className="text-end">
                Salir
              </Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
