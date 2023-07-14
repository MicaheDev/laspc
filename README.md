## Laspc Demo (Las point clouds)

Este proyecto proporciona una forma sencilla de visualizar archivos .las (LiDAR) en formato de nube de puntos 3D en el navegador web. El visor convierte las posiciones y los colores en el archivo LAS en una nube de puntos renderizada en WebGL utilizando la biblioteca Three.js.

Además, este proyecto utiliza React y Next.js para la interfaz de usuario. Los archivos LAS se cargan en el navegador a través de la biblioteca loaders.gl.

## Funcionalidad

- Cargar y decodificar archivos .las.
- Generar y renderizar una nube de puntos en 3D a partir de los datos decodificados.
- Proporcionar controles orbitales para interactuar con la visualización en 3D.
- Centrar y escalar la nube de puntos para una visualización óptima.
- Simplificar y Optimizarlas nubes de puntos para mejor rendimiento.

## Inicio rápido

Clonar el repositorio.

```bash 
npm install
npm run dev.
```
## Uso

Para usar el visualizador de nube de puntos, abre el proyecto en un navegador web. Asegúrate de tener un archivo .las en el directorio 
public/file.las disponible para cargar en la aplicación.