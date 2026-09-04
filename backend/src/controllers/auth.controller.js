import bcrypt from 'bcrypt';
import { pool } from '../config/db.js';
import jwt from 'jsonwebtoken';

export const registrarUsuario = async (req, res) => {
  try {
    // 1. Recibimos los datos que envía el frontend
    const { rut, nombres, primer_apellido, email, telefono, password } = req.body;

    // 2. Validamos que vengan los datos obligatorios
    if (!rut || !nombres || !primer_apellido || !email || !password) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // ==========================================
    // VALIDACIÓN DE CONTRASEÑA
    // ==========================================
    // Regex: Mínimo 6 caracteres, al menos 1 letra y 1 número. Permite símbolos.
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        error: 'La contraseña debe tener al menos 6 caracteres, e incluir tanto letras como números.' 
      });
    }
    // ==========================================

    // 3. Verificamos si el correo o rut ya existen
    const usuarioExistente = await pool.query(
      'SELECT * FROM auth.usuarios WHERE email = $1 OR rut = $2',
      [email, rut]
    );

    if (usuarioExistente.rows.length > 0) {
      return res.status(400).json({ error: 'El RUT o Correo ya están registrados' });
    }

    // 4. Encriptamos la contraseña
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 5. Guardamos en la base de datos
    const nuevoUsuario = await pool.query(
      `INSERT INTO auth.usuarios 
      (rut, nombres, primer_apellido, email, telefono, password_hash) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING id, nombres, email, rol`, 
      [rut, nombres, primer_apellido, email, telefono, passwordHash]
    );

    // 6. Respondemos al frontend con éxito
    res.status(201).json({
      mensaje: 'Usuario registrado con éxito',
      usuario: nuevoUsuario.rows[0]
    });

  } catch (error) {
    console.error('❌ Error en el registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validamos que vengan los datos
    if (!email || !password) {
      return res.status(400).json({ error: 'Faltan credenciales' });
    }

    // 2. Buscamos al usuario en la base de datos
    const resultado = await pool.query(
      'SELECT * FROM auth.usuarios WHERE email = $1 AND is_active = true',
      [email]
    );

    if (resultado.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas o cuenta bloqueada' });
    }

    const usuario = resultado.rows[0];

    // 3. Comparamos la contraseña encriptada
    const claveValida = await bcrypt.compare(password, usuario.password_hash);

    if (!claveValida) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // 4. Generamos Token JWT
    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol }, 
      process.env.JWT_SECRET,
      { expiresIn: '24h' } // El token durará 1 día
    );

    // 5. Respondemos con éxito
    res.json({
      mensaje: 'Login exitoso',
      token: token,
      usuario: {
        id: usuario.id,
        nombres: usuario.nombres,
        email: usuario.email,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error('❌ Error en el login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const obtenerPerfil = async (req, res) => {
  try {
    // 1. Obtenemos el ID del usuario decodificado desde el token (inyectado por el middleware)
    const usuarioId = req.usuario.id;

    // ==========================================
    // CONSULTA DE PERFIL (SELECT)
    // ==========================================
    // Seleccionamos todos los campos públicos del usuario usando su ID, omitiendo el password por seguridad.
    const resultado = await pool.query(
      `SELECT id, rut, nombres, primer_apellido, segundo_apellido, genero, email, telefono, rol, avatar_url, comuna_id, villa_poblacion_id, ultima_conexion, instagram_url, facebook_url, is_active, strikes, created_at 
       FROM auth.usuarios 
       WHERE id = $1`,
      [usuarioId]
    );
    // ==========================================

    // 3. Validamos si el usuario existe en la base de datos
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // 4. Respondemos al frontend con los datos obtenidos directamente de la BD
    res.json({
      mensaje: '¡Bienvenido a ConectaPo!',
      usuario_conectado: resultado.rows[0] 
    });

  } catch (error) {
    console.error('❌ Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const actualizarPerfil = async (req, res) => {
  try {
    // 1. Obtenemos el ID del usuario autenticado desde el token decodificado por el middleware
    const usuarioId = req.usuario.id;

    // 2. Recibimos los campos editables que envía el frontend
    const { 
      nombres, 
      primer_apellido, 
      segundo_apellido, 
      genero, 
      telefono, 
      avatar_url, 
      comuna_id, 
      villa_poblacion_id, 
      instagram_url, 
      facebook_url 
    } = req.body;

    // ==========================================
    // ACTUALIZACIÓN PARCIAL CON COALESCE (PUT)
    // ==========================================
    // COALESCE evalúa los parámetros: si el valor enviado es NULL o undefined, 
    // conserva el valor actual que ya estaba almacenado en la base de datos.
    const query = `
      UPDATE auth.usuarios 
      SET 
        nombres = COALESCE($1, nombres),
        primer_apellido = COALESCE($2, primer_apellido),
        segundo_apellido = COALESCE($3, segundo_apellido),
        genero = COALESCE($4, genero),
        telefono = COALESCE($5, telefono),
        avatar_url = COALESCE($6, avatar_url),
        comuna_id = COALESCE($7, comuna_id),
        villa_poblacion_id = COALESCE($8, villa_poblacion_id),
        instagram_url = COALESCE($9, instagram_url),
        facebook_url = COALESCE($10, facebook_url)
      WHERE id = $11
      RETURNING id, rut, nombres, primer_apellido, segundo_apellido, genero, email, telefono, rol, avatar_url, comuna_id, villa_poblacion_id, instagram_url, facebook_url, created_at;
    `;

    const values = [
      nombres, 
      primer_apellido, 
      segundo_apellido, 
      genero, 
      telefono, 
      avatar_url, 
      comuna_id, 
      villa_poblacion_id, 
      instagram_url, 
      facebook_url,
      usuarioId
    ];

    const resultado = await pool.query(query, values);
    // ==========================================

    // 3. Validamos si el usuario existe antes de responder
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // 4. Respondemos al frontend con el perfil ya modificado
    res.json({
      mensaje: '¡Perfil actualizado exitosamente!',
      usuario: resultado.rows[0]
    });

  } catch (error) {
    console.error('❌ Error al actualizar el perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const desactivarUsuario = async (req, res) => {
  try {
    // 1. Obtenemos el ID del usuario desde los parámetros de la ruta
    const { id } = req.params;

    // ==========================================
    // BORRADO LÓGICO DE USUARIO (DELETE / PATCH)
    // ==========================================
    // Cambiamos el estado is_active a false para desactivar lógicamente el registro 
    // sin perder la integridad referencial ni borrar datos de la base de datos.
    const query = `
      UPDATE auth.usuarios 
      SET is_active = false 
      WHERE id = $1 
      RETURNING id, email, is_active;
    `;

    const resultado = await pool.query(query, [id]);
    // ==========================================

    // 3. Validamos si el usuario existe en la base de datos
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // 4. Respondemos al frontend con el éxito de la operación
    res.json({
      mensaje: 'Usuario desactivado correctamente',
      usuario: resultado.rows[0]
    });

  } catch (error) {
    console.error('❌ Error al desactivar el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};