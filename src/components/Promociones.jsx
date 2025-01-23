import { useEffect, useState } from 'react';
import { Button, Container, Table, Modal, Form } from 'react-bootstrap';
import Swal from "sweetalert2";
import "../Styles/Promociones.css";

export const Promociones = () => {
  const [promociones, setPromociones] = useState([]); // Estado para guardar las promociones
  const [sucursales, setSucursales] = useState([]); // Estado para guardar las sucursales
  const [showModal, setShowModal] = useState(false); // Estado para controlar el modal
  const [isEditMode, setIsEditMode] = useState(false); // Estado para diferenciar entre crear y editar
  const [editPromocionId, setEditPromocionId] = useState(null); // ID de la promoción a editar
  const [formPromocion, setFormPromocion] = useState({
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

  // Función para obtener las sucursales del endpoint
  const fetchSucursales = async () => {
    try {
      const response = await fetch('http://localhost:5244/Sucursales?PageNumber=1&PageSize=10');
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setSucursales(data.registros); // Guardar los registros de sucursales
    } catch (error) {
      console.error('Error al obtener las sucursales:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar las sucursales. Intenta nuevamente más tarde.',
      });
    }
  };

  // Función para obtener el nombre de la sucursal por su ID
  const getSucursalNombre = (idSucursal) => {
    const sucursal = sucursales.find((s) => s.id === idSucursal);
    return sucursal ? sucursal.nombre : "Desconocido";
  };

  // Cargar las promociones y sucursales al cargar el componente
  useEffect(() => {
    fetchPromociones();
    fetchSucursales();
  }, []);

  // Función para manejar el cambio de los inputs en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormPromocion({ ...formPromocion, [name]: value });
  };

  // Función para guardar o editar una promoción
  const handleSavePromocion = async () => {
    try {
      const method = isEditMode ? 'PUT' : 'POST';
      const url = isEditMode
        ? `http://localhost:5244/api/Promociones/${editPromocionId}`
        : 'http://localhost:5244/api/Promociones';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formPromocion),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: isEditMode
          ? 'La promoción se actualizó correctamente.'
          : 'La promoción se creó correctamente.',
      });

      setShowModal(false); // Cerrar el modal
      setFormPromocion({
        descripcion: "",
        valorPuntos: "",
        minimoParaCanje: "",
        idSucursal: "",
        estatus: true,
      }); // Limpiar el formulario
      setIsEditMode(false);
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

  // Función para mostrar el modal en modo edición
  const handleEditPromocion = (promocion) => {
    setFormPromocion(promocion);
    setEditPromocionId(promocion.id);
    setIsEditMode(true);
    setShowModal(true);
  };

  // Función para eliminar una promoción
  const handleDeletePromocion = async (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Esta acción no se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:5244/api/Promociones/${id}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }

          Swal.fire('Eliminado', 'La promoción ha sido eliminada.', 'success');
          fetchPromociones(); // Recargar las promociones
        } catch (error) {
          console.error('Error al eliminar la promoción:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar la promoción. Intenta nuevamente más tarde.',
          });
        }
      }
    });
  };

  return (
    <>
      <Container className="plantas-container">
        <div className="d-flex justify-content-end align-items-center mb-3">
          <Button
            variant="success"
            onClick={() => {
              setShowModal(true);
              setIsEditMode(false);
              setFormPromocion({
                descripcion: "",
                valorPuntos: "",
                minimoParaCanje: "",
                idSucursal: "",
                estatus: true,
              });
            }}
          >
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
                    <td>{getSucursalNombre(promocion.idSucursal)}</td>
                    <td>{promocion.estatus ? "Activa" : "Inactiva"}</td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handleEditPromocion(promocion)}
                      >
                        Editar
                      </Button>{' '}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeletePromocion(promocion.id)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No hay promociones disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Container>

      {/* Modal para crear o editar una promoción */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? 'Editar Promoción' : 'Crear Nueva Promoción'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                name="descripcion"
                value={formPromocion.descripcion}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Valor Puntos</Form.Label>
              <Form.Control
                type="number"
                name="valorPuntos"
                value={formPromocion.valorPuntos}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Canje Mínimo</Form.Label>
              <Form.Control
                type="number"
                name="minimoParaCanje"
                value={formPromocion.minimoParaCanje}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Planta</Form.Label>
              <Form.Select
                name="idSucursal"
                value={formPromocion.idSucursal}
                onChange={handleInputChange}
              >
                <option value="">Seleccione una planta</option>
                {sucursales.map((sucursal) => (
                  <option key={sucursal.id} value={sucursal.id}>
                    {sucursal.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Estatus</Form.Label>
              <Form.Check
                type="checkbox"
                label="Activo"
                name="estatus"
                checked={formPromocion.estatus}
                onChange={(e) =>
                  setFormPromocion({ ...formPromocion, estatus: e.target.checked })
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
            {isEditMode ? 'Actualizar' : 'Guardar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
