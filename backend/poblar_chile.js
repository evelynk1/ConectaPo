import 'dotenv/config';
import { pool } from './src/config/db.js';

const poblarUbicaciones = async () => {
    try {
        console.log('⏳ Descargando datos de Chile desde el Gist de Juan Brujo...');

        // Obtenemos el JSON crudo directamente desde GitHub
        const url = 'https://gist.githubusercontent.com/juanbrujo/0fd2f4d126b3ce5a95a7dd1f28b3d8dd/raw/b15eba8d056345b9d1e8bc5258604313f8909890/comunas-regiones.json';
        const respuesta = await fetch(url);
        const data = await respuesta.json();

        console.log('✅ Datos descargados. Iniciando inserción en Neon...');

        let contadorRegiones = 1;
        let contadorCiudades = 1;
        let contadorComunas = 1;

        for (const item of data.regiones) {
            // 1. Insertar la Región
            await pool.query(
                'INSERT INTO ubicaciones.regiones (id, nombre) VALUES ($1, $2)',
                [contadorRegiones, item.region]
            );

            // 2. Insertar la Ciudad "Puente" (para no romper tu esquema)
            const nombreCiudadFicticia = `Provincia/Ciudades de ${item.region}`;
            await pool.query(
                'INSERT INTO ubicaciones.ciudades (id, region_id, nombre) VALUES ($1, $2, $3)',
                [contadorCiudades, contadorRegiones, nombreCiudadFicticia]
            );

            // 3. Insertar todas las Comunas de esa región
            for (const nombreComuna of item.comunas) {
                await pool.query(
                    'INSERT INTO ubicaciones.comunas (id, ciudad_id, nombre) VALUES ($1, $2, $3)',
                    [contadorComunas, contadorCiudades, nombreComuna]
                );
                contadorComunas++;
            }

            contadorRegiones++;
            contadorCiudades++;
        }

        console.log(`🎉 ¡Éxito total! Se insertaron:`);
        console.log(`- ${contadorRegiones - 1} Regiones`);
        console.log(`- ${contadorCiudades - 1} Ciudades/Provincias`);
        console.log(`- ${contadorComunas - 1} Comunas`);

        // Cerramos la conexión para que la terminal no se quede pegada
        await pool.end();

    } catch (error) {
        console.error('❌ Error fatal al poblar la base de datos:', error);
    }
};

poblarUbicaciones();