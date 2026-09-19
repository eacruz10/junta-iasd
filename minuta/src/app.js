const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const puntoRoutes = require('./routes/puntoRoutes');
const acuerdoRoutes = require('./routes/acuerdoRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir archivos estáticos (Frontend HTML/JS)
app.use(express.static(path.join(__dirname, '../public')));

// Rutas API
app.use('/api/puntos', puntoRoutes);
app.use('/api/acuerdos', acuerdoRoutes);

// Redireccionar raíz al login/index
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = app;