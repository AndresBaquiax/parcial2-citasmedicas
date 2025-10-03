export const querysEmpleados = {
    getEmpleados: "SELECT * FROM empleado",
    postEmpleado: "INSERT INTO empleado (nombre, apellido, telefono, email, cargo) VALUES ($1, $2, $3, $4, $5)",
    putEmpleado: "UPDATE empleado SET nombre = $1, apellido = $2, telefono = $3, email = $4, cargo = $5 WHERE idempleado = $6",
    deleteEmpleado: "DELETE FROM empleado WHERE id = $1"
};

export const querysMedicos = {
    getMedicos: "SELECT * FROM medicos",
    postMedico: "INSERT INTO medicos (nombre, apellido, especialidad, telefono) VALUES ($1, $2, $3, $4)",
    putMedico: "UPDATE medicos SET nombre = $1, apellido = $2, especialidad = $3, telefono = $4 WHERE medico_id = $6",
    deleteMedico: "DELETE FROM medicos WHERE id = $1"
};