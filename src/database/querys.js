export const querysEmpleados = {
    getEmpleados: "SELECT * FROM empleado",
    postEmpleado: "INSERT INTO empleado (nombre, apellido, telefono, email, cargo) VALUES ($1, $2, $3, $4, $5)",
    putEmpleado: "UPDATE empleado SET nombre = $1, apellido = $2, telefono = $3, email = $4, cargo = $5 WHERE idempleado = $6",
    deleteEmpleado: "DELETE FROM empleado WHERE id = $1"
};


export const querysPacientes = {
    getPacientes: "SELECT * FROM Pacientes",
    postPaciente: "INSERT INTO Pacientes (nombre, apellido, fecha_nacimiento, genero, telefono, direccion) VALUES ($1, $2, $3, $4, $5, $6)",
    putPaciente: "UPDATE Pacientes SET nombre=$1, apellido=$2, fecha_nacimiento=$3, genero=$4, telefono=$5, direccion=$6 WHERE idempleado = $7",
    deletePaciente: "DELETE FROM Pacientes WHERE id = $1"
};

/*
    paciente_id       SERIAL PRIMARY KEY,
    nombre            VARCHAR(100) NOT NULL,
    apellido          VARCHAR(100) NOT NULL,
    fecha_nacimiento  DATE NOT NULL,
    genero            VARCHAR(10) CHECK (genero IN ('M','F','Otro')),
    telefono          VARCHAR(20),
    email             VARCHAR(100) UNIQUE,
    direccion         VARCHAR(255),*/