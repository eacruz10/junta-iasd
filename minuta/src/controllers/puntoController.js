const db = require('../config/db');

// 1. Crear una propuesta de punto (Uso: Líder de Departamento)
exports.crearPunto = async (req, res) => {
  const { id_junta, id_departamento, id_creador, titulo_punto, descripcion_inicial, presupuesto_estimado } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO puntos_agenda (id_junta, id_departamento, id_creador, titulo_punto, descripcion_inicial, presupuesto_estimado)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [id_junta, id_departamento, id_creador, titulo_punto, descripcion_inicial, presupuesto_estimado || 0.00]
    );

    res.status(201).json({
      mensaje: 'Punto registrado con éxito. Enviado a revisión del anciano.',
      punto: result.rows[0]
    });
  } catch (error) {
    console.error('Error al crear punto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 2. Revisión del Anciano (Aprobar o Rechazar)
exports.revisionAnciano = async (req, res) => {
  const { id } = req.params; // ID del punto
  const { estado, motivo_rechazo } = req.body; // 'Aprobado_Por_Anciano' o 'Rechazado_Por_Anciano'

  try {
    const result = await db.query(
      `UPDATE puntos_agenda 
       SET estado = $1, motivo_rechazo = $2 
       WHERE id_punto = $3 RETURNING *`,
      [estado, motivo_rechazo || null, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'El punto especificado no existe.' });
    }

    res.status(200).json({
      mensaje: `Punto actualizado a estado: ${estado}`,
      punto: result.rows[0]
    });
  } catch (error) {
    console.error('Error al revisar punto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};