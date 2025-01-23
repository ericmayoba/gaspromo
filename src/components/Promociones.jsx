import { useEffect, useState } from 'react';
import { Button, Container, Table } from 'react-bootstrap';
import Swal from "sweetalert2";
import "../Styles/Promociones.css";

export const Promociones = () => {
  const [promociones, setPromociones] = useState([]); // Estado para guardar las promociones

  // Función para obtener las promociones del endpoint
  const fetchPromociones = async () => {
    try {
      const response = await fetch('http://localhost:5244/api/Promociones?PageNumber=1&PageSize=10');
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      setPromociones(data); // Guardar los datos en el estado
    } catch (error) {
      console.error('Error al obtener las promociones:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar las promociones. Intenta nuevamente más tarde.',
      });
    }
  };

  // Cargar las promociones al cargar el componente
  useEffect(() => {
    fetchPromociones();
  }, []);

  return (
    <>
      <Container className="plantas-container">
        <div className="d-flex justify-content-end align-items-center mb-3">
          <Button variant="success" onClick={() => console.log('Crear promoción')}>
            Crear Promoción
          </Button>
        </div>
        <div className="promociones-content">
          <h1>Mantenimiento de Promociones</h1>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Promoción</th>
                <th>Valor Puntos</th>
                <th>Canje Mínimo</th>
                <th>Planta</th>
                <th>Estatus</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(promociones.registros) && promociones.registros.length > 0 ? (
                promociones.registros.map((promocion) => (
                  <tr key={promocion.id}>
                    <td>{promocion.descripcion}</td>
                    <td>{promocion.valorPuntos}</td>
                    <td>{promocion.minimoParaCanje}</td>
                    <td>{promocion.idSucursal}</td>
                    <td>{promocion.estatus}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No hay promociones disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Container>
    </>
  );
};
