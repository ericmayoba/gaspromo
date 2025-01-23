import { useEffect, useState } from 'react';
import { Button, Container, Table, Modal, Form } from 'react-bootstrap';
import Swal from "sweetalert2";
import "../Styles/Promociones.css";

export const Promociones = () => {
  const [promociones, setPromociones] = useState([]); // Estado para guardar las promociones
  const [showModal, setShowModal] = useState(false); // Estado para controlar el modal
  const [newPromocion, setNewPromocion] = useState({
    descripcion: "",
    valorPuntos: "",
    minimoParaCanje: "",
    idSucursal: "",
    estatus: true,
  }); // Estado para guardar los datos del formulario

  // Función para obtener las promociones del endpoint
  const fetchPromociones = async () => {
    try {
      const response = await fetch('http://localhost:5244/api/Promociones?PageNumber=1&PageSize=10');
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
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

  // Función para manejar el cambio de los inputs en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPromocion({ ...newPromocion, [name]: value });
  };

  // Función para enviar los datos al endpoint
  const handleSavePromocion = async () => {
    try {
        console.info(newPromocion)
      const response = await fetch('http://localhost:5244/api/Promociones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPromocion),
        
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'La promoción se creó correctamente.',
      });

      setShowModal(false); // Cerrar el modal
      setNewPromocion({
        descripcion: "",
        valorPuntos: "",
        minimoParaCanje: "",
        idSucursal: "",
        estatus: "",
      }); // Limpiar el formulario
      fetchPromociones(); // Recargar las promociones
    } catch (error) {
      console.error('Error al guardar la promoción:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo guardar la promoción. Intenta nuevamente más tarde.',
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
          <Button variant="success" onClick={() => setShowModal(true)}>
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
                <th>Acciones</th>
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
                    <td>{promocion.estatus ? "Activa" : "Inactiva"}</td>
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

      {/* Modal para crear una nueva promoción */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Nueva Promoción</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                name="descripcion"
                value={newPromocion.descripcion}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Valor Puntos</Form.Label>
              <Form.Control
                type="number"
                name="valorPuntos"
                value={newPromocion.valorPuntos}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Canje Mínimo</Form.Label>
              <Form.Control
                type="number"
                name="minimoParaCanje"
                value={newPromocion.minimoParaCanje}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Planta</Form.Label>
              <Form.Control
                type="text"
                name="idSucursal"
                value={newPromocion.idSucursal}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label>Estatus</Form.Label>
            <Form.Check
                type="checkbox"
                label="Activo"
                name="estatus"
                checked={newPromocion.estatus}
                onChange={(e) =>
                setNewPromocion({ ...newPromocion, estatus: e.target.checked })
                }
            />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSavePromocion}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
