export const querysEmpleados = {
    getEmpleados: "SELECT * FROM empleado",
    postEmpleado: "INSERT INTO empleado (nombre, apellido, telefono, email, cargo) VALUES ($1, $2, $3, $4, $5)",
    putEmpleado: "UPDATE empleado SET nombre = $1, apellido = $2, telefono = $3, email = $4, cargo = $5 WHERE idempleado = $6",
    deleteEmpleado: "DELETE FROM empleado WHERE id = $1"
};

export const querysCitas = {
    getCitas: "SELECT * FROM Citas ORDER BY fecha_cita DESC",
    getCitaById: "SELECT * FROM Citas WHERE cita_id = $1",
    postCita: "INSERT INTO Citas (paciente_id, medico_id, fecha_cita, motivo, estado, tipo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    putCita: "UPDATE Citas SET paciente_id = $1, medico_id = $2, fecha_cita = $3, motivo = $4, estado = $5, tipo = $6 WHERE cita_id = $7",
    deleteCita: "DELETE FROM Citas WHERE cita_id = $1"
};