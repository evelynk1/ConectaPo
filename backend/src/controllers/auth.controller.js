import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { pool } from '../config/db.js';
import jwt from 'jsonwebtoken';

export const registrarUsuario = async (req, res) => {
  try {

    const { rut, nombres, primer_apellido, email, telefono, password } = req.body;

    if (!rut || !nombres || !primer_apellido || !email || !password) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // ==========================================
    // VALIDACIÓN DE CONTRASEÑA
    // ==========================================
    // Mínimo 6 caracteres, al menos 1 letra y 1 número. Permite símbolos.
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error: 'La contraseña debe tener al menos 6 caracteres, e incluir tanto letras como números.'
      });
    }

    const usuarioExistente = await pool.query(
      'SELECT * FROM auth.usuarios WHERE email = $1 OR rut = $2',
      [email, rut]
    );

    if (usuarioExistente.rows.length > 0) {
      return res.status(400).json({ error: 'El RUT o Correo ya están registrados' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const nuevoUsuario = await pool.query(
      `INSERT INTO auth.usuarios 
      (rut, nombres, primer_apellido, email, telefono, password_hash) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING id, nombres, email, rol`,
      [rut, nombres, primer_apellido, email, telefono, passwordHash]
    );

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

    if (!email || !password) {
      return res.status(400).json({ error: 'Faltan credenciales' });
    }

    const resultado = await pool.query(
      'SELECT * FROM auth.usuarios WHERE email = $1 AND is_active = true',
      [email]
    );

    if (resultado.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas o cuenta bloqueada' });
    }

    const usuario = resultado.rows[0];

    const claveValida = await bcrypt.compare(password, usuario.password_hash);

    if (!claveValida) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '24h' } // El token durará 1 día
    );


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

    const usuarioId = req.usuario.id;

    // ==========================================
    // CONSULTA DE PERFIL (SELECT)
    // ==========================================

    const resultado = await pool.query(
      `SELECT id, rut, nombres, primer_apellido, segundo_apellido, genero, email, telefono, rol, avatar_url, comuna_id, villa_poblacion_id, ultima_conexion, instagram_url, facebook_url, is_active, strikes, created_at 
       FROM auth.usuarios 
       WHERE id = $1`,
      [usuarioId]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

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
    const usuarioId = req.usuario.id;
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

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

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

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      mensaje: 'Usuario desactivado correctamente',
      usuario: resultado.rows[0]
    });

  } catch (error) {
    console.error('❌ Error al desactivar el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ==========================================
// RECUPERACIÓN DE CONTRASEÑA
// ==========================================
// PASO 1: SOLICITAR RECUPERACIÓN (Generar Link)
// ==========================================
export const solicitarRecuperacion = async (req, res) => {
  try {
    const { telefono } = req.body;

    if (!telefono) {
      return res.status(400).json({ error: 'Debes proporcionar un número de teléfono.' });
    }

    const userQuery = await pool.query('SELECT id, nombres FROM auth.usuarios WHERE telefono = $1', [telefono]);
    if (userQuery.rows.length === 0) {
      return res.status(200).json({ mensaje: 'Si el número existe, se ha enviado un link de recuperación.' });
    }

    const usuario = userQuery.rows[0];

    // 1. Solo generamos el token en Node
    const resetToken = crypto.randomBytes(32).toString('hex');

    // 2. Guardar en BD: Dejamos que Postgres calcule los 15 minutos
    await pool.query(
      `UPDATE auth.usuarios 
       SET reset_token = $1, 
           reset_token_expires = NOW() + INTERVAL '15 minutes' 
       WHERE id = $2`,
      [resetToken, usuario.id]
    );

    // 3. SIMULACIÓN DE WHATSAPP
    const linkRecuperacion = `https://conectapo.cl/recuperar?token=${resetToken}`;

    console.log(`\n📲 [SIMULACIÓN WHATSAPP] Enviando mensaje a ${telefono}...`);
    console.log(`Hola ${usuario.nombres}, para recuperar tu contraseña ingresa a: ${linkRecuperacion}\n`);

    res.status(200).json({
      mensaje: 'Link de recuperación generado exitosamente (revisa la consola del servidor).',
      linkSimulado: linkRecuperacion,
      token: resetToken
    });

  } catch (error) {
    console.error('❌ Error al solicitar recuperación:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// ==========================================
// PASO 2: RESETEAR CONTRASEÑA (Usar el Token)
// ==========================================
export const resetearPassword = async (req, res) => {
  try {
    const { token, nueva_password } = req.body;

    if (!token || !nueva_password) {
      return res.status(400).json({ error: 'El token y la nueva contraseña son obligatorios.' });
    }

    // ==========================================
    // VALIDACIÓN DE CONTRASEÑA (Igual que en Registro)
    // ==========================================
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(nueva_password)) {
      return res.status(400).json({
        error: 'La nueva contraseña debe tener al menos 6 caracteres, e incluir tanto letras como números.'
      });
    }

    // 1. Buscar usuario con token vigente
    const query = `
            SELECT id FROM auth.usuarios 
            WHERE reset_token = $1 AND reset_token_expires > NOW()
        `;
    const result = await pool.query(query, [token]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'El token es inválido o ha expirado.' });
    }

    const usuario_id = result.rows[0].id;

    // 2. Encriptar la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(nueva_password, salt);

    // 3. Actualizar contraseña y limpiar el token
    await pool.query(
      'UPDATE auth.usuarios SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2',
      [hashedPassword, usuario_id]
    );

    res.status(200).json({ mensaje: '¡Contraseña actualizada con éxito! Ya puedes iniciar sesión.' });

  } catch (error) {
    console.error('❌ Error al resetear contraseña:', error);
    res.status(500).json({ error: 'Error interno al cambiar la contraseña.' });
  }
};