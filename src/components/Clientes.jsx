import { useState, useEffect } from "react";
import { Button, Modal, Form, Container } from "react-bootstrap";
import Swal from "sweetalert2";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import '../Styles/Clientes.css'; 

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Variable de entorno

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [plantas, setPlantas] = useState([]); 
  const [cliente, setCliente] = useState(null); 
  const [showModal, setShowModal] = useState(false); 
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);  
  const [totalPages, setTotalPages] = useState(0);
  const [modalMode, setModalMode] = useState("create");
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10; 

  // Cargar lista de plantas
  useEffect(() => {
    fetch(`${API_BASE_URL}/Sucursales`)
      .then((res) => res.json())
      .then((data) => setPlantas(data))
      .catch((error) => console.error(error));
  }, []);

  // Cargar lista de clientes
  useEffect(() => {
    setIsLoading(true); 
    const timer = setTimeout(() => { 
      fetch(`${API_BASE_URL}/api/Clientes?PageNumber=${currentPage}&PageSize=${pageSize}`)
        .then((res) => res.json())
        .then((data) => {
          setClientes(data.registros); 
          setTotalPages(Math.ceil(data.totalRegistros / itemsPerPage)); // totalRegistros para calcular el total de páginas
        })
        .catch((error) => console.error(error))
        .finally(() => setIsLoading(false)); 
    }, 500);  

    return () => clearTimeout(timer);  
  }, [currentPage, pageSize]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500); 
    return () => clearTimeout(timer);
  }, []);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleShowModal = (cliente = null, mode = "create") => {
    setCliente(cliente ? { ...cliente } : {
      id: 0,
      codigo: "",
      nombre: "",
      apellido: "",
      vehiculo: "",
      tipoVehiculo: "",
      telefono: "",
      planta: "",
    });
    setModalMode(mode);
    setShowModal(true);

    // Asignar los valores al formulario utilizando setValue
    if (cliente) {
      setValue("id", cliente.id);
      setValue("codigo", cliente.codigo);
      setValue("nombre", cliente.nombre);
      setValue("apellido", cliente.apellido);
      setValue("vehiculo", cliente.vehiculo);
      setValue("tipoVehiculo", cliente.tipoVehiculo);
      setValue("telefono", cliente.telefono);
      setValue("planta", cliente.planta);
    }
  };

  // Resetear los campos del formulario
  const resetForm = () => {
    reset({
      codigo: "",
      nombre: "",
      apellido: "",
      vehiculo: "",
      tipoVehiculo: "",
      telefono: "",
      planta: "",
    });
  };

  // Validación con Yup
  const schema = Yup.object({
    codigo: Yup.string()
      .required("El código es obligatorio")
      .matches(/^\d{5}$/, "El código debe tener exactamente 5 dígitos numéricos"),
    nombre: Yup.string().required("El nombre es obligatorio"),
    apellido: Yup.string().required("El apellido es obligatorio"),
    vehiculo: Yup.string().required("El vehículo es obligatorio"),
    tipoVehiculo: Yup.string().required("El tipo de vehículo es obligatorio"),
    telefono: Yup.string()
      .required("El teléfono es obligatorio")
      .matches(/^\d{3}-\d{3}-\d{4}$/, "El teléfono debe tener el formato 999-999-9999"),
    planta: Yup.string().required("La planta es obligatoria"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset, 
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: cliente,
  });

  const handleSave = (data) => {
    // Verificar si el código ya existe en la lista de clientes
    const existingCliente = clientes.find((cliente) => cliente.codigo === data.codigo);

    if (existingCliente && !data.id) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "El código del cliente ya existe.",
      });
      return; 
    }

    const clienteData = {
      ...data,
      id: cliente.id,  
    };
    const endpoint = cliente.id
    ? `${API_BASE_URL}/api/Clientes/${cliente.codigo}`
    : `${API_BASE_URL}/api/Clientes`;
    const method = cliente.id ? "PUT" : "POST";
    const successMessage = cliente.id
      ? "Cliente actualizado exitosamente"
      : "Cliente creado exitosamente";

    fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(clienteData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(cliente.codigo ? "Error al actualizar el cliente" : "Error al crear el cliente");
        }
        return response.status !== 204 ? response.json() : null; 
      })
      .then((savedCliente) => {
        if (savedCliente) {
          if (cliente.id) {
            setClientes((prev) =>
              prev.map((c) => (c.id === savedCliente.id ? savedCliente : c))
            );
          } else {
            setClientes((prev) => [...prev, savedCliente]);
          }
        }
        setShowModal(false);
        resetForm(); // Resetear formulario después de guardar
        Swal.fire("Éxito", successMessage, "success");
      })
      .catch((error) => {
        Swal.fire("Error", error.message, "error");
      });    
  };

  const handleDelete = (codigo) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, borrar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${API_BASE_URL}/api/Clientes/${codigo}`, {
          method: "DELETE",
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Error al eliminar el cliente.");
            }
            setClientes((prev) => prev.filter((cliente) => cliente.codigo !== codigo));
            Swal.fire("Eliminado", "El cliente ha sido eliminado.", "success");
          })
          .catch((error) => {
            Swal.fire("Error", error.message, "error");
          });
      }
    });
  };

  return (
    <Container className="clientes-container">    
        <div className="d-flex justify-content-end align-items-center mb-3">
      <Button variant="success" onClick={() => handleShowModal(null, "create")}>
        Crear Cliente
      </Button>
    </div>
    <div className="clientes-content">

    {isLoading ? (
    <div className="text-center">
    <img src="/src/assets/loading.gif" alt="Cargando..." />
    </div>
    ) : (
    <div>
      <div className="text-success">
        <h3>Mantenimiento de Clientes</h3>
      </div>
      <div className="card-body">
        <table className="table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Vehículo</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
          {Array.isArray(clientes) && 
            clientes.length > 0 ? (
              clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.codigo}</td>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.apellido}</td>
                  <td>{cliente.vehiculo}</td>
                  <td>{cliente.telefono}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => handleShowModal(cliente, "view")}
                    >
                      Detalle
                    </Button>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => handleShowModal(cliente, "edit")}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(cliente.codigo)}
                    >
                      Borrar
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No hay datos disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="pagination d-flex justify-content-center align-items-center mb-3">
          <Button variant="success" onClick={goToPreviousPage} disabled={currentPage === 1}>
            Anterior
          </Button>
          <span>  Página {currentPage} de {totalPages}</span>
          <Button variant="success" onClick={goToNextPage} disabled={currentPage === totalPages}>
            Siguiente
          </Button>
        </div>
      </div>
    </div>
    )}

    {/* Modal para Crear, Editar o Ver Detalle */}
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{modalMode === "view" ? "Detalle del Cliente" : modalMode === "edit" ? "Editar Cliente" : "Crear Nuevo Cliente"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit(handleSave)}>
          <Form.Group className="mb-3">
            <Form.Label>Código</Form.Label>
            <Controller
              name="codigo"
              control={control}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  type="text"
                  disabled={modalMode === "edit" || modalMode === "view"}  // Deshabilitar en modo edición o vista
                  isInvalid={!!errors.codigo}
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.codigo?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Controller
              name="nombre"
              control={control}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  type="text"
                  disabled={modalMode === "view"}
                  isInvalid={!!errors.nombre}
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.nombre?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Apellido</Form.Label>
            <Controller
              name="apellido"
              control={control}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  type="text"
                  disabled={modalMode === "view"}
                  isInvalid={!!errors.apellido}
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.apellido?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Vehículo</Form.Label>
            <Controller
              name="vehiculo"
              control={control}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  type="text"
                  disabled={modalMode === "view"}
                  isInvalid={!!errors.vehiculo}
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.vehiculo?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Tipo de Vehículo</Form.Label>
            <Controller
              name="tipoVehiculo"
              control={control}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  type="text"
                  disabled={modalMode === "view"}
                  isInvalid={!!errors.tipoVehiculo}
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.tipoVehiculo?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Teléfono</Form.Label>
            <Controller
              name="telefono"
              control={control}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  type="text"
                  disabled={modalMode === "view"}
                  isInvalid={!!errors.telefono}
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.telefono?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Planta</Form.Label>
            <Controller
              name="planta"
              control={control}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  as="select"
                  disabled={modalMode === "view"}
                  isInvalid={!!errors.planta}
                >
                  <option value="">Seleccione una planta</option>
                  {plantas.registros.map((planta) => (
                    <option key={planta.id} value={planta.id}>
                      {planta.nombre}
                    </option>
                  ))}
                </Form.Control>
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.planta?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" className="ms-2">
              Guardar
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
    </div>
  </Container>
  );
};

export default Clientes;
