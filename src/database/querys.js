export const querysPacientes = {
    getPacientes: "SELECT * FROM Pacientes",
    postPaciente: "INSERT INTO Pacientes (nombre, apellido, fecha_nacimiento, genero, telefono, direccion) VALUES ($1, $2, $3, $4, $5, $6)",
    putPaciente: "UPDATE Pacientes SET nombre=$1, apellido=$2, fecha_nacimiento=$3, genero=$4, telefono=$5, direccion=$6 WHERE idempleado = $7",
    deletePaciente: "DELETE FROM Pacientes WHERE id = $1"
};
export const querysCitas = {
    getCitas: "SELECT * FROM Citas ORDER BY fecha_cita DESC",
    getCitaById: "SELECT * FROM Citas WHERE cita_id = $1",
    postCita: "INSERT INTO Citas (paciente_id, medico_id, fecha_cita, motivo, estado, tipo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    putCita: "UPDATE Citas SET paciente_id = $1, medico_id = $2, fecha_cita = $3, motivo = $4, estado = $5, tipo = $6 WHERE cita_id = $7",
    deleteCita: "DELETE FROM Citas WHERE cita_id = $1"
};
