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
export const querysPacientes = {
    getPacientes: "SELECT * FROM Pacientes",
    postPaciente: "INSERT INTO Pacientes (nombre, apellido, fecha_nacimiento, genero, telefono, direccion) VALUES ($1, $2, $3, $4, $5, $6)",
    putPaciente: "UPDATE Pacientes SET nombre=$1, apellido=$2, fecha_nacimiento=$3, genero=$4, telefono=$5, direccion=$6 WHERE paciente_id = $7",
    deletePaciente: "DELETE FROM Pacientes WHERE paciente_id = $1"
};
export const querysCitas = {
    getCitas: "SELECT * FROM Citas ORDER BY fecha_cita DESC",
    getCitaById: "SELECT * FROM Citas WHERE cita_id = $1",
    postCita: "INSERT INTO Citas (paciente_id, medico_id, fecha_cita, motivo, estado, tipo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    putCita: "UPDATE Citas SET paciente_id = $1, medico_id = $2, fecha_cita = $3, motivo = $4, estado = $5, tipo = $6 WHERE cita_id = $7",
    deleteCita: "DELETE FROM Citas WHERE cita_id = $1"
};

export const querysBonos = {
    // Obtener médicos con más de 50 pacientes únicos desde el lunes
    getMedicosConMasDe50Pacientes: `
        SELECT 
            m.medico_id,
            m.nombre,
            m.apellido,
            m.especialidad,
            COUNT(DISTINCT c.paciente_id) as total_pacientes
        FROM Medicos m
        INNER JOIN Citas c ON m.medico_id = c.medico_id
        WHERE c.fecha_cita >= date_trunc('week', CURRENT_DATE) -- Desde el lunes de esta semana
        AND c.estado = 'Completada'
        GROUP BY m.medico_id, m.nombre, m.apellido, m.especialidad
        HAVING COUNT(DISTINCT c.paciente_id) > 50
    `,
    // Insertar un bono
    insertBono: "INSERT INTO Bonos_Medicos (medico_id, monto, fecha_asignado) VALUES ($1, $2, $3) RETURNING *",
    // Verificar si ya se asignó bono esta semana
    verificarBonoSemana: `
        SELECT * FROM Bonos_Medicos 
        WHERE medico_id = $1 
        AND fecha_asignado >= date_trunc('week', CURRENT_DATE)
    `,
    // Obtener todos los bonos
    getBonos: "SELECT * FROM Bonos_Medicos ORDER BY fecha_asignado DESC",
    // Obtener bonos por médico
    getBonosPorMedico: "SELECT * FROM Bonos_Medicos WHERE medico_id = $1 ORDER BY fecha_asignado DESC"
};
