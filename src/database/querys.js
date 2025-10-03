export const querysCitas = {
    getCitas: "SELECT * FROM Citas ORDER BY fecha_cita DESC",
    getCitaById: "SELECT * FROM Citas WHERE cita_id = $1",
    postCita: "INSERT INTO Citas (paciente_id, medico_id, fecha_cita, motivo, estado, tipo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    putCita: "UPDATE Citas SET paciente_id = $1, medico_id = $2, fecha_cita = $3, motivo = $4, estado = $5, tipo = $6 WHERE cita_id = $7",
    deleteCita: "DELETE FROM Citas WHERE cita_id = $1"
};