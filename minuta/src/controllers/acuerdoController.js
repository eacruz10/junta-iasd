const db = require('../config/db');

// 1. Asentar Acuerdo Final Ganador (Uso: Secretaria durante la junta)
exports.asentarAcuerdo = async (req, res) => {
  const { id_punto, detalle_aprobado, presupuesto_aprobado } = req.body;

  try {
    // Transacción SQL para asegurar consistencia
    await db.query('BEGIN');

    // Inserta el acuerdo oficial inmutable (Usando 'acuerdos')
    const acuerdoResult = await db.query(
      `INSERT INTO acuerdos (id_punto, detalle_aprobado, presupuesto_aprobado)
       VALUES ($1, $2, $3) RETURNING *`,
      [id_punto, detalle_aprobado, presupuesto_aprobado || 0.00]
    );

    // Actualiza el estado del punto a 'Asentado' (Usando 'puntos_agenda')
    await db.query(
      `UPDATE puntos_agenda SET estado = 'Asentado' WHERE id_punto = $1`,
      [id_punto]
    );

    await db.query('COMMIT');

    res.status(201).json({
      mensaje: 'Acuerdo asentado e inmutable registrado con éxito.',
      acuerdo: acuerdoResult.rows[0]
    });
  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Error al asentar acuerdo:', error);
    res.status(500).json({ error: 'Error al registrar el acuerdo en la base de datos.' });
  }
};

// 2. Buscador Avanzado de Tesorería (Uso: Tesorero / Pastor / Ancianos)
exports.consultarTesorería = async (req, res) => {
  const { departamento, busqueda } = req.query;

  let queryText = `
    SELECT 
      a.id_acuerdo,
      j.fecha_junta,
      d.nombre_departamento,
      p.titulo_punto,
      a.detalle_aprobado,
      a.presupuesto_aprobado
    FROM acuerdos a
    JOIN puntos_agenda p ON a.id_punto = p.id_punto
    JOIN departamentos d ON p.id_departamento = d.id_departamento
    JOIN juntas j ON p.id_junta = j.id_junta
    WHERE 1=1
  `;
  
  const queryParams = [];

  // Filtro opcional por departamento
  if (departamento) {
    queryParams.push(departamento);
    queryText += ` AND d.id_departamento = $${queryParams.length}`;
  }

  // Filtro de búsqueda por palabra clave
  if (busqueda) {
    queryParams.push(`%${busqueda}%`);
    queryText += ` AND (p.titulo_punto ILIKE $${queryParams.length} OR a.detalle_aprobado ILIKE $${queryParams.length})`;
  }

  queryText += ` ORDER BY j.fecha_junta DESC`;

  try {
    const result = await db.query(queryText, queryParams);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error en consulta de tesorería:', error);
    res.status(500).json({ error: 'Error al consultar datos contables.' });
  }
};