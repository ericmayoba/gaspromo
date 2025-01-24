import { useEffect, useState } from 'react';
import { Form, Button, Container, Modal, Table } from 'react-bootstrap';
import "../Styles/Plantas.css";
import Swal from "sweetalert2";

export const Plantas = () => {
  const [sucursales, setSucursales] = useState([]); 
  const [showModal, setShowModal] = useState(false); 
  const [selectedPlanta, setSelectedPlanta] = useState(null);
  const [editData, setEditData] = useState({ nombre: '', descripcion: '' });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlanta, setNewPlanta] = useState({ nombre: '', descripcion: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); 
  const itemsPerPage = 5; 

  // Obtener datos desde el endpoint
  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const response = await fetch(`http://localhost:5244/Sucursales?PageNumber=${currentPage}&PageSize=${itemsPerPage}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setSucursales(data.registros); // Datos de la página actual
        setTotalPages(data.totalRegistros); // Total de páginas desde el backend
      } catch (error) {
        console.error('Error al obtener las sucursales:', error);
      }
    };
    fetchSucursales();
  }, [currentPage]); // Reejecutar al cambiar la página actual

  
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

    // Manejar la eliminación de una planta
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5244/Sucursales/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        Swal.fire('Error', `Error al eliminar: ${response.status}`, 'error');
        return;
      }

      Swal.fire('Éxito', 'Planta eliminada con éxito', 'success');
      // Actualizar la lista de sucursales eliminando la planta
      setSucursales((prev) => prev.filter((sucursal) => sucursal.id !== id));
    } catch (error) {
      console.error('Error al eliminar la planta:', error);
      Swal.fire('Error', 'Hubo un problema al eliminar la planta.', 'error');
    }
  };

  const handleShowModal = () => {
    setNewPlanta({ nombre: '', descripcion: '' }); // Limpiar los campos del modal
    setShowCreateModal(true); // Mostrar el modal
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setNewPlanta((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSave = async () => {
    try {
      const response = await fetch('http://localhost:5244/Sucursales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPlanta),
      });

      if (!response.ok) {
        Swal.fire('Error', `Error al crear planta: ${response.status}`, 'error');
        return;
      }

      const createdPlanta = await response.json();
      Swal.fire('Éxito', 'Planta creada con éxito', 'success');

      // Agregar la nueva planta a la lista
      setSucursales((prev) => [...prev, createdPlanta]);
      setShowCreateModal(false); // Cerrar el modal
    } catch (error) {
      console.error('Error al crear la planta:', error);
      Swal.fire('Error', 'Hubo un problema al crear la planta.', 'error');
    }
  };

  // Funciones para cambiar de página
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };




  return (
    <Container className="plantas-container">
        <div className="d-flex justify-content-end align-items-center mb-3">
      <Button variant="success" onClick={() => handleShowModal(null, "create")}>
        Crear Planta
      </Button>
    </div>
      <div className="plantas-content">
        <div className='text-success'>
        <h3>Mantenimiento de Plantas</h3>
        </div>
        
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Planta</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
          {Array.isArray(sucursales) && sucursales.length > 0 ? (
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
                      onClick={() => {
                        Swal.fire({
                          title: '¿Estás seguro?',
                          text: 'No podrás deshacer esta acción.',
                          icon: 'warning',
                          showCancelButton: true,
                          confirmButtonColor: '#d33',
                          cancelButtonColor: '#3085d6',
                          confirmButtonText: 'Sí, eliminar',
                          cancelButtonText: 'Cancelar',
                        }).then((result) => {
                          if (result.isConfirmed) {
                            handleDelete(sucursal.id);
                          }
                        });
                      }}
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
        <div className="d-flex justify-content-center">
          <Button
            variant="success"
            disabled={currentPage === 1}
            onClick={handlePreviousPage}
          >
            Anterior
          </Button>
          <span>Página {currentPage} de {totalPages}</span>
          <Button
            variant="success"
            disabled={currentPage === totalPages}
            onClick={handleNextPage}
          >
            Siguiente
          </Button>
        </div>      
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

      {/* Modal para crear */}
    <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
    <Modal.Header closeButton>
      <Modal.Title>Crear Planta</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group controlId="formPlantaNombre" className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="nombre"
            value={newPlanta.nombre}
            onChange={handleCreateChange}
          />
        </Form.Group>
        <Form.Group controlId="formPlantaDescripcion" className="mb-3">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="descripcion"
            value={newPlanta.descripcion}
            onChange={handleCreateChange}
          />
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
        Cancelar
      </Button>
      <Button variant="success" onClick={handleCreateSave}>
        Guardar
      </Button>
    </Modal.Footer>
  </Modal>
    </Container>
  );
};


