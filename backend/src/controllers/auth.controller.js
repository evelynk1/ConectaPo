import bcrypt from 'bcrypt';
import { pool } from '../config/db.js';

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