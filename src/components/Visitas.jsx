
import { useRef, useEffect, useState } from 'react';
import { Button, Form } from "react-bootstrap";
import { BrowserMultiFormatReader } from '@zxing/library';
import Swal from "sweetalert2";
import "../Styles/Visitas.css";
import { useVisitas}  from '../Context/VisitasContext';


export const Visitas = () => {
    const { visitas, agregarVisita, validarVisitaReciente } = useVisitas();
    const videoRef = useRef(null);
    const [barcode, setBarcode] = useState('');
    const [data, setData] = useState({
        codigo: '',
        cliente: '',
        vehiculo: '',
        telefono: '',
        visitas: ''
    });
    const [lastScannedCode, setLastScannedCode] = useState('');

    useEffect(() => {
        const codeReader = new BrowserMultiFormatReader();
        const formats = [
            'CODE_128',
            'CODE_39',
            'EAN_13',
            'EAN_8',
            'ITF',
            'UPC_A',
            'UPC_E',
            'QR_CODE',
        ];

        codeReader
            .decodeFromVideoDevice(
                null,
                videoRef.current,
                (result, err) => {
                    if (result) {
                        const scannedCode = result.getText();
                        setBarcode(scannedCode);

                        if (scannedCode !== lastScannedCode) {
                            setLastScannedCode(scannedCode);
                            fetchData(scannedCode);
                        }
                    }
                },
                { formats }
            )
            .catch((err) => console.error(err));

        return () => {
            codeReader.reset();
        };
    }, [lastScannedCode]);

    const fetchData = async (codigo) => {
        try {
            const response = await fetch(`http://localhost:5244/api/Canjes/GetDataCanje?codigo=${codigo}`);
            if (response.ok) {
                const result = await response.json();
                const data = result[0] || {};

                setData({
                    codigo: codigo,
                    cliente: data.cliente || '',
                    vehiculo: data.vehiculo || '',
                    telefono: data.telefono || '',
                    visitas: data.visitas || 0
                });
            } else {
                console.error('Error al consultar el endpoint');
                cleanData();
            }
        } catch (error) {
            console.error('Error de red:', error);
            cleanData();
        }
    };

    const handleGuardarVisita = async () => {
        if (!data.codigo) {
          Swal.fire("Error", "No se ha capturado ningún código para guardar la visita.", "error");
          return;
        }
      
        const esVisitaReciente = await validarVisitaReciente(data.codigo); // Esperamos el resultado
      
        if (esVisitaReciente) {
          Swal.fire(
            "Warning",
            "Las visitas para acumular puntos se contabilizan diariamente. Puedes obtener el servicio, pero esta visita no te sumará puntos.",
            "warning"
          );
          return; // Detenemos la ejecución si ya hay una visita reciente
        }
      
        // Continuamos con el guardado si no hay una visita reciente
        const nuevaVisita = { data, fecha: new Date() };
        agregarVisita(nuevaVisita);
      
        const body = {
          codigoCliente: data.codigo,
          fechaVisita: new Date().toISOString(), // Fecha actual en formato ISO
          estatusVisita: true,
        };
      
        try {
          const response = await fetch("http://localhost:5244/api/Visitas", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });
      
          if (response.ok) {
            Swal.fire("Éxito", "Visita guardada con éxito.", "success");
            cleanData();
          } else {
            console.error("Error al guardar la visita:", response.statusText);
            Swal.fire(
              "Error",
              "Ocurrió un error al guardar la visita. Por favor, inténtelo de nuevo.",
              "error"
            );
          }
        } catch (error) {
          Swal.fire("Error", `Error de red al guardar la visita: ${error}`, "error");
        }
      };
      
      

    const cleanData = () => {
        setData({
            codigo: '',
            cliente: '',
            vehiculo: '',
            telefono: '',
            visitas: ''
        });
    }

    return (
        <div className="container">
            <div className="content">
                {/* Columna izquierda */}
                <div className="text-success">
                    <h3>Captura</h3>
                    <video ref={videoRef} className="video" />
                </div>

                {/* Línea de separación vertical */}
                <div className="separator"></div>

                {/* Columna derecha */}
                <div className="data-section">
                    <div className="text-success">
                    <h3>Información del Cliente</h3>
                    </div>
                    
                    <div className='form-control'>
                        <label><strong>Código:</strong> {data.codigo}</label>
                    </div>
                    <div className='form-control'>
                        <label><strong>Cliente:</strong> {data.cliente}</label>
                    </div>
                    <div className='form-control'>
                        <label><strong>Vehículo:</strong> {data.vehiculo}</label>
                    </div>
                    <div className='form-control'>
                        <label><strong>Teléfono:</strong> {data.telefono}</label>
                    </div>
                    <div className='form-control'>
                        <label><strong>Visitas:</strong> {data.visitas}</label>
                    </div>
                    <div className='boton'> 
                        <Button onClick={handleGuardarVisita}>Guardar Visita</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
