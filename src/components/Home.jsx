
import '/src/Styles/Home.css'; 
import logo from '../assets/logo.png';

const Home = () => {
  return (
    <div className="home-container">
      <div className="welcome-box">
        <img 
          src={logo}
          alt="Coopegas Promo" 
          className="welcome-logo"
        />
        <h1>Bienvenido</h1>
        <p>
          Bienvenido al sistema de puntos <strong>CoopegasPromo</strong> en el cual podrás registrar clientes, usuarios, sucursales y también canjear tus puntos por galones de gas.
        </p>
      </div>
    </div>
  );
};

export default Home;
