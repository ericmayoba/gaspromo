
import { useForm } from 'react-hook-form';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import "../Styles/Canjes.css"

export const Canjes = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <>
    <h1 className="mt-4">Formulario de Canje</h1>
    <Container className='container'>
        
    <div className='content'>
     
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className="mb-4">
          <Col md={4}>
            <Form.Group controlId="codigo">
              <Form.Label>Código</Form.Label>
              <Form.Control
                type="number"
                {...register('codigo', { required: 'El código es obligatorio' })}
                isInvalid={!!errors.codigo}
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


// default Canjes;
