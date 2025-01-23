import { useEffect, useState } from 'react';
import { Form, Button, Container, Modal, Table } from 'react-bootstrap';
import "../Styles/Plantas.css";
import Swal from "sweetalert2";

export const Plantas = () => {
  const [sucursales, setSucursales] = useState([]); // Estado para almacenar los datos
  const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
  const [selectedPlanta, setSelectedPlanta] = useState(null); // Estado para almacenar la planta seleccionada
  const [editData, setEditData] = useState({ nombre: '', descripcion: '' }); // Estado para editar los campos

  // Obtener datos desde el endpoint
  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const response = await fetch('http://localhost:5244/Sucursales');
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setSucursales(data);
      } catch (error) {
        console.error('Error al obtener las sucursales:', error);
      }
    };
    fetchSucursales();
  }, []);

  // Manejar la apertura del modal y cargar los datos de la planta seleccionada
  const handleEdit = (planta) => {
    setSelectedPlanta(planta);
    setEditData({ nombre: planta.nombre, descripcion: planta.descripcion });
    setShowModal(true);
  };

  // Manejar los cambios en los campos del formulario del modal
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  // Guardar los cambios y enviar la solicitud PUT al backend
  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5244/Sucursales/${selectedPlanta.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedPlanta.id,
          nombre: editData.nombre,
          descripcion: editData.descripcion,
        }),
      });

      if (!response.ok) {
        Swal.fire('Error', `Error al guardar: ${response.status}`, 'error');
      }
      
      Swal.fire('Éxito', 'Planta Modificada con éxito', 'success');
      // Actualizar la planta en la lista sin necesidad de recargar
      setSucursales((prev) =>
        prev.map((sucursal) =>
          sucursal.id === selectedPlanta.id ? { ...sucursal, ...editData } : sucursal
        )
      );

      setShowModal(false); // Cerrar el modal después de guardar
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  };

  return (
    <Container className="plantas-container">
      <div className="plantas-content">
        <h1>Mantenimiento de Plantas</h1>
        <Table striped bordered hover>
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
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(sucursal)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => alert(`Eliminar: ${sucursal.nombre}`)}
                    >
                      Eliminar
                    </Button>
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
        </Table>
      </div>

      {/* Modal para editar */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Planta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formPlantaNombre" className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={editData.nombre}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formPlantaDescripcion" className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="descripcion"
                value={editData.descripcion}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="success" onClick={handleSave}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
