-- database/schema.sql
CREATE TABLE departamentos (
    id_departamento SERIAL PRIMARY KEY,
    nombre_departamento VARCHAR(100) NOT NULL
);

CREATE TABLE juntas (
    id_junta SERIAL PRIMARY KEY,
    fecha_junta DATE NOT NULL,
    estado VARCHAR(20) DEFAULT 'Programada'
);

CREATE TABLE puntos_agenda (
    id_punto SERIAL PRIMARY KEY,
    id_junta INT REFERENCES juntas(id_junta),
    id_departamento INT REFERENCES departamentos(id_departamento),
    id_creador INT NOT NULL,
    titulo_punto VARCHAR(200) NOT NULL,
    descripcion_inicial TEXT NOT NULL,
    presupuesto_estimado NUMERIC(10,2) DEFAULT 0.00,
    estado VARCHAR(30) DEFAULT 'Creado',
    motivo_rechazo TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE acuerdos (
    id_acuerdo SERIAL PRIMARY KEY,
    id_punto INT UNIQUE REFERENCES puntos_agenda(id_punto),
    detalle_aprobado TEXT NOT NULL,
    presupuesto_aprobado NUMERIC(10,2) DEFAULT 0.00,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos semilla de prueba
INSERT INTO departamentos (nombre_departamento) VALUES 
('Ministerio de la Salud'), ('Jóvenes / Clubes'), ('Escuela Sabática'), ('Pro-Templo');

INSERT INTO juntas (fecha_junta, estado) VALUES ('2026-08-15', 'En Vivo');