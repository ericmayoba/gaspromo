import { useRef, useEffect, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

export const Visitas = () => {
    const videoRef = useRef(null);
    const [barcode, setBarcode] = useState('');

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
                setBarcode(result.getText()); // Captura el código de barras
              }
            },
            { formats }
          )
          .catch((err) => console.error(err));
      
        return () => {
          codeReader.reset();
        };
      }, []);
      

  return (
    <>
        <div className="content">
        <section className="capture-section">
          <h3>Captura</h3>
          <video ref={videoRef} style={{ width: '100%', height: '200px', border: '1px solid #ccc' }} />
        {barcode && (
          <div>
            <strong>Código capturado:</strong> {barcode}
          </div>
        )}
        </section>

        <section className="datos-cliente-section">
          <h3>Datos Cliente</h3>
          <table className="cliente-table">
            <thead>
              <tr>
                <th>Codigo</th>
              </tr>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Vehiculo</th>
                <th>Telefono</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input type="text" placeholder="Nombre" />
                </td>
                <td>
                  <input type="text" placeholder="Apellido" />
                </td>
                <td>
                  <input type="text" placeholder="Vehiculo" />
                </td>
                <td>
                  <input type="text" placeholder="Telefono" />
                </td>
              </tr>
              <tr>
                <td>
                  <input type="text" placeholder="Visitas" />
                </td>
                <td colSpan="3">
                  <button className="submit-button">Submit</button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </>

  )
}
