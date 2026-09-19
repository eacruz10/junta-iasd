const express = require('express');
const router = express.Router();
const acuerdoController = require('../controllers/acuerdoController');

// Ruta para que la secretaria asiente el acuerdo final
router.post('/asentar', acuerdoController.asentarAcuerdo);

// Ruta para que el tesorero consulte los sustentos
router.get('/tesoreria', acuerdoController.consultarTesorería);

module.exports = router;