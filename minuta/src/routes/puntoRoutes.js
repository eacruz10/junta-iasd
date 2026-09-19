const express = require('express');
const router = express.Router();
const puntoController = require('../controllers/puntoController');

// Ruta para que el directivo cree un punto
router.post('/', puntoController.crearPunto);

// Ruta para que el anciano apruebe o rechace un punto
router.patch('/:id/revision-anciano', puntoController.revisionAnciano);

module.exports = router;