import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; 
import "../Styles/registro.css"; 

const Registro = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('Usuario registrado exitosamente');
        setIsSuccess(true);

        Swal.fire({
          title: '¡Registro exitoso!',
          text: 'El registro fue exitoso, ahora serás redirigido al login.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        }).then(() => {
          navigate('/login');
        });
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Error al registrar usuario');
        setIsSuccess(false);
      }
    } catch (err) {
      setMessage('Error de conexión con el servidor');
      setIsSuccess(false);
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-content">
        <Form className='registro-form' onSubmit={handleSubmit}>
          <h2 className="text-success">Registro</h2>
          {message && (
            <Alert variant={isSuccess ? 'success' : 'danger'}>{message}</Alert>
          )}
          <Form.Group className="mb-3">
            <Form.Label>Nombre de usuario</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="Nombre de usuario"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button type="submit" variant="success">
            Registrar
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Registro;
