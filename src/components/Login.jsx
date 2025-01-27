import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../Context/AuthContext'; 
import "../Styles/Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth(); 
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); 
        login(); 
        navigate('/');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Credenciales inválidas');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <Form onSubmit={handleSubmit} className='login-form'>
          <h2 className="text-success">Iniciar sesión</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group className="mb-3">
            <Form.Label>Usuario</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="Ingresa tu usuario"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Ingresa tu contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button type="submit" variant="success" disabled={isLoading}>
            {isLoading ? 'Cargando...' : 'Iniciar sesión'}
          </Button>
          <div className="mt-3 text-center">
            <p>
              ¿No tienes una cuenta?{' '}
              <Link to="/registro" className="text-success">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
