/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from 'react';

// Crear el contexto
const VisitasContext = createContext();
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Proveedor del contexto
export const VisitasProvider = ({ children }) => {
  const [visitas, setVisitas] = useState([]);


  const agregarVisita = (visita) => {
    setVisitas((prevVisitas) => [...prevVisitas, visita]);
  };

const validarVisitaReciente = async (codigoCliente) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Visitas/${codigoCliente}`);
    
    if (!response.ok) {
      console.error(`Error al obtener la última visita: ${response.statusText}`);
      return false; // Permitimos guardar la visita si el endpoint falla
    }

    const ultimaVisita = await response.json();

    // Si no se encontró una visita previa, permitimos guardar la visita
    if (!ultimaVisita || !ultimaVisita.fechaVisita) {
      console.log(`No se encontró una visita previa para el cliente: ${codigoCliente}`);
      return false; // El cliente no tiene visitas recientes
    }

    const ahora = new Date();
    const fechaVisita = new Date(ultimaVisita.fechaVisita);

    if (isNaN(fechaVisita)) {
      console.error(`Fecha inválida en la última visita: ${ultimaVisita.fechaVisita}`);
      return false; // Permitimos guardar la visita si la fecha es inválida
    }

    const diferenciaHoras = (ahora - fechaVisita) / (1000 * 60 * 60); // Diferencia en horas
    console.log(`Cliente: ${codigoCliente}, Última visita: ${fechaVisita}, DiferenciaHoras: ${diferenciaHoras}`);

    return diferenciaHoras <= 24; // Devuelve true si la visita fue en las últimas 24 horas
  } catch (error) {
    console.error("Error al validar visita reciente:", error);
    return false; // Permitimos guardar la visita en caso de error
  }
};

  

  return (
    <VisitasContext.Provider value={{ visitas, agregarVisita, validarVisitaReciente }}>
      {children}
    </VisitasContext.Provider>
  );
};

// Hook personalizado para acceder al contexto
export const useVisitas = () => useContext(VisitasContext);
