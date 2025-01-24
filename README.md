# Proyecto de React - CoopPromo
Una aplicacion para gestionar la promocion CoopPromo que consiste en la generacion de puntos en cada visita de los clientes a las plantas de gas licuado de petroleo  asi como la obtencion  o canje de galones de gas ganados por los puntos de la promocion.

## Descripción
Este proyecto es una aplicación web desarrollada en React que incluye varios módulos para gestionar diferentes aspectos de un sistema:

- **Clientes**: Gestiona la información de los clientes.
- **Canjes**: Permite registrar y consultar los canjes realizados por los clientes.
- **Plantas**: Administra información sobre las plantas disponibles.
- **Promociones**: Gestiona las promociones activas.
- **Visitas**: Permite registrar visitas y gestionar el historial de los clientes.

## Tabla de Contenidos
- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)

## Tecnologías
El proyecto utiliza las siguientes herramientas y bibliotecas:

- [React](https://reactjs.org/) - v18.0.0
- [React Router](https://reactrouter.com/) - v6.6.1
- [Vite](https://vitejs.dev/) - v4.0.0
- [Bootstrap](https://getbootstrap.com/) - v5.2.0
- [SweetAlert2](https://sweetalert2.github.io/) - Para notificaciones.
- [ZXing Library](https://github.com/zxing-js/library) - Para lectura de códigos de barras y QR.
- [@hookform/resolvers](https://www.npmjs.com/package/@hookform/resolvers) -  3.10.0
- [react-bootstrap](https://react-bootstrap.netlify.app) - 2.10.8

## Instalación
Sigue estos pasos para configurar el proyecto:

1. Clona este repositorio:
   ```bash
   git clone https://github.com/usuario/proyecto-react.git
   ```
2. Entra en la carpeta del proyecto:
   ```bash
   cd proyecto-react
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```
4. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables de entorno:
   ```env
   VITE_API_BASE_URL=https://api.tuservidor.com

   ```
5. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Uso
1. Inicia el servidor de desarrollo con `npm run dev`.
2. Abre tu navegador en `http://localhost:5173`.
3. Navega por los módulos disponibles:
   - **Clientes**: Permite ver, crear y gestionar clientes.
   - **Canjes**: Registra códigos de canjes y consulta información relacionada.
   - **Plantas**: Consulta información sobre plantas disponibles.
   - **Promociones**: Visualiza y administra promociones activas.
   - **Visitas**: Escanea códigos QR o de barras para registrar visitas.

## Estructura del Proyecto
```plaintext
├── public/                # Archivos estáticos
├── src/                   # Código fuente
│   ├── components/        # Componentes reutilizables
│   │   ├── Clientes.jsx   # Módulo de Clientes
│   │   ├── Canjes.jsx     # Módulo de Canjes
│   │   ├── Plantas.jsx    # Módulo de Plantas
│   │   ├── Promociones.jsx # Módulo de Promociones
│   │   ├── Visitas.jsx    # Módulo de Visitas
│   │   ├── MyNavbar.jsx   # Módulo de Navegacion
│   │   ├── Home.jsx       # Módulo inicial de bienvenida
│   ├── styles/            # Archivos de estilos (CSS/SCSS)
│   ├── App.jsx            # Punto de entrada principal
│   ├── main.jsx           # Configuración de React y renderizado
├── .env                   # Variables de entorno
├── package.json           # Dependencias y scripts del proyecto
```


## Licencia
Este proyecto está licenciado bajo la [MIT License](https://opensource.org/licenses/MIT).

