/*import '/src/Styles/Navbar.css'; */
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

const MyNavbar = () => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="success" data-bs-theme="dark">
    <Container className="justify-content-center">
      <Navbar.Brand href="/" className="text-center">Home</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-center">
        <Nav>
          <Nav.Link href="/clientes" className="text-center">Clientes</Nav.Link>
          <Nav.Link href="/visitas" className="text-center">Visitas</Nav.Link>
          <Nav.Link href="/canjes" className="text-center">Canjes</Nav.Link>
          <NavDropdown
            title="Admin"
            id="collapsible-nav-dropdown"
            className="text-center custom-success-dropdown"
          >
            <NavDropdown.Item href="#action/3.1">Plantas</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">Promociones</NavDropdown.Item>
            <NavDropdown.Divider />
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
    );  
};

export default MyNavbar;