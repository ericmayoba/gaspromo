
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import Swal from "sweetalert2";
import "../Styles/Canjes.css"

export const Canjes = () => {
  
  const [codigo, setCodigo] = useState('');
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  const handleCodigoBlur = async (event) => {
    const inputCodigo = event.target.value;
    setCodigo(inputCodigo);

    if (inputCodigo) {
      try {
        const response = await fetch(`http://localhost:5244/api/Canjes/GetDataCanje?codigo=${inputCodigo}`);
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            const canjeData = data[0];
            setValue('cliente', canjeData.cliente);
            setValue('visitas', canjeData.visitas);
            setValue('ganados', canjeData.ganados);
            setValue('canjeados', canjeData.canjeados);
            setValue('disponibles', canjeData.disponibles);
            setValue('fechaUltimoCanje', new Date(canjeData.fecha_Ultimo_Canje).toISOString().slice(0, 16));
          } else {
            Swal.fire("Error", "No se encontraron datos para el código ingresado.", "error"); 
          }
        } else {
            Swal.fire("Error", "Error al obtener los datos del canje'.", "error"); 
        }
      } catch (error) {
        console.error('Error al obtener los datos del canje:', error);
        Swal.fire("Error", "Error de red al intentar obtener los datos del canje'.", "error"); 
      }
    }
  };

  return (
    <>
    
    <Container className='container'>
        
    <div className='content'>
        <div className='title'>
            <h1 className="mt-4">Formulario de Canje</h1>
        </div>
     
      <Form onSubmit={handleSubmit(onSubmit)}>
      <Row className="mb-4">
          <Col md={4}>
            <Form.Group controlId="codigo">
              <Form.Label>Código</Form.Label>
              <Form.Control
                type="number"
                {...register('codigo', { required: 'El código es obligatorio', maxLengthength: { value: 5, message: 'El código de tener 5 digitos numericos.' }, minLength: { value: 5, message: 'El código de tener 5 digitos numericos.' } })}
                isInvalid={!!errors.codigo}
                onBlur={handleCodigoBlur}
              />
              <Form.Control.Feedback type="invalid">
                {errors.codigo?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
        <Col md={12}>
            <Form.Group controlId="cliente">
              <Form.Label>Cliente</Form.Label>
              <Form.Control
                type="text"
                {...register('cliente')}
                readOnly
                defaultValue="Cliente"
                className="disabled-input"                
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-6">
          <Col md={6}>
            <Form.Group controlId="visitas">
              <Form.Label>Visitas</Form.Label>
              <Form.Control
                type="number"
                {...register('visitas')}
                readOnly
                defaultValue={0}
                className="disabled-input"
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="ganados">
              <Form.Label>Ganados</Form.Label>
              <Form.Control
                type="number"
                {...register('ganados')}
                readOnly
                defaultValue={0}
                className="disabled-input"
              />
            </Form.Group>
          </Col>

         
        </Row>
        
        <Row className="mb-6">
        <Col md={6}>
            <Form.Group controlId="canjeados">
              <Form.Label>Canjeados</Form.Label>
              <Form.Control
                type="number"
                {...register('canjeados')}
                readOnly
                defaultValue={0}
                className="disabled-input"
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="disponibles">
              <Form.Label>Disponibles</Form.Label>
              <Form.Control
                type="number"
                {...register('disponibles')}
                readOnly
                defaultValue={0}
                className="disabled-input"
              />
            </Form.Group>
          </Col>

        </Row>
        

        <Row className="mb-3">

        <Col md={6}>
            <Form.Group controlId="fechaUltimoCanje">
              <Form.Label>Fecha Último Canje</Form.Label>
              <Form.Control
                type="datetime-local"
                {...register('fechaUltimoCanje')}
                readOnly
                defaultValue={new Date().toISOString().slice(0, 16)}
                className="disabled-input"
              />
            </Form.Group>
          </Col>
         
          <Col md={6}>
            <Form.Group controlId="canjear">
              <Form.Label>Canjear</Form.Label>
              <Form.Control
                type="number"
                {...register('canjear', { required: 'Debe ingresar la cantidad a canjear' })}
                isInvalid={!!errors.canjear}
              />
              <Form.Control.Feedback type="invalid">
                {errors.canjear?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          
        </Row>
        <div className='boton'>
        <Button variant="success" type="submit" className='boton' size='lg'>
          Enviar
        </Button>
        </div>
        
      </Form>
      </div>
    </Container>
    </>
  );
};

