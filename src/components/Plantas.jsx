import { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import "../Styles/Plantas.css"

export const Plantas = () => {
  const [sucursales, setSucursales] = useState([]); // Estado para almacenar los datos

  useEffect(() => {
    // Función para obtener los datos del endpoint
    const fetchSucursales = async () => {
      try {
        const response = await fetch('http://localhost:5244/Sucursales');
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setSucursales(data); // Almacena los datos en el estado
      } catch (error) {
        console.error('Error al obtener las sucursales:', error);
      }
    };

    fetchSucursales();
  }, []); // Ejecuta el efecto solo una vez al cargar el componente

  return (
    <Container className="plantas-container">
          <div className='plantas-content'>
        <div>
            <h1>Mantenimiento de Plantas</h1>
        </div>
      <div >
        <table className="table">
          <thead>
            <tr>
              <th>Planta</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sucursales.length > 0 ? (
              sucursales.map((sucursal) => (
                <tr key={sucursal.id}>
                  <td>{sucursal.nombre}</td>
                  <td>{sucursal.descripcion}</td>
                  <td>
                    <button className="btn btn-primary btn-sm me-2" onClick={() => alert(`Ver: ${sucursal.nombre}`)}>Ver</button>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => alert(`Editar: ${sucursal.nombre}`)}>Editar</button>
                    <button className="btn btn-danger btn-sm" onClick={() => alert(`Eliminar: ${sucursal.nombre}`)}>Eliminar</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  No hay datos disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </Container>
  );
};
