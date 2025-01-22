import { useRef, useEffect, useState } from 'react';
import { Button, Form } from "react-bootstrap";
import { BrowserMultiFormatReader } from '@zxing/library';
import "../Styles/Visitas.css"

export const Visitas = () => {
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
                    visitas: data.visitas || ''
                });
            } else {
                console.error('Error al consultar el endpoint');
                setData({
                    codigo: '',
                    cliente: '',
                    vehiculo: '',
                    telefono: '',
                    visitas: ''
                });
            }
        } catch (error) {
            console.error('Error de red:', error);
            setData({
                codigo: '',
                cliente: '',
                vehiculo: '',
                telefono: '',
                visitas: ''
            });
        }
    };

    const handleGuardarVisita = () => {
        alert('Visita guardada con éxito.');
    };

    return (
        <div className="container">
    <div className="content">
        {/* Columna izquierda */}
        <div className="capture-section">
            <h3>Captura</h3>
            <video ref={videoRef} className="video" />
        </div>

        {/* Línea de separación vertical */}
        <div className="separator"></div>

        {/* Columna derecha */}
        <div className="data-section">
            <h3>Información del Cliente</h3>
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
            <Button  onClick={handleGuardarVisita}>Guardar Visita</Button>
            </div>
            
        </div>
    </div>
</div>
    );
};
