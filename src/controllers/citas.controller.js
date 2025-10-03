import { getConnection, querysCitas } from "../database/index.js";

// --------------------- GET ALL ---------------------
export const getCitas = async (req, res) => {
    try {
        // Obtenemos la conexion
        const connection = await getConnection();
        const result = await connection.query(querysCitas.getCitas);
        // Liberamos la conexion
        connection.release();
        res.json(result.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// --------------------- GET BY ID ---------------------
export const getCitaById = async (req, res) => {
    try {
        const { id } = req.params;

        // Obtenemos la conexion
        const connection = await getConnection();
        const result = await connection.query(querysCitas.getCitaById, [id]);
        // Liberamos la conexion
        connection.release();

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: "Cita no encontrada" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// --------------------- POST ---------------------
export const postCita = async (req, res) => {
    try {
        const { paciente_id, medico_id, fecha_cita, motivo, estado, tipo } = req.body;

        // Validamos los datos obligatorios
        if (!paciente_id || !medico_id || !fecha_cita) {
            return res.status(400).json({ msg: "Bad Request. Please fill all required fields (paciente_id, medico_id, fecha_cita)." });
        }

        // Valores por defecto
        const estadoFinal = estado || 'Pendiente';
        const tipoFinal = tipo || 'Primera';

        // Validamos el estado
        if (!['Pendiente', 'Completada', 'Cancelada'].includes(estadoFinal)) {
            return res.status(400).json({ msg: "Estado inválido. Debe ser: Pendiente, Completada o Cancelada" });
        }

        // Validamos el tipo
        if (!['Primera', 'Reconsulta'].includes(tipoFinal)) {
            return res.status(400).json({ msg: "Tipo inválido. Debe ser: Primera o Reconsulta" });
        }

        // Obtenemos la conexion
        const connection = await getConnection();

        // Ejecutamos la consulta
        const result = await connection.query(querysCitas.postCita, [
            paciente_id,
            medico_id,
            fecha_cita,
            motivo || null,
            estadoFinal,
            tipoFinal
        ]);

        // Liberamos la conexion
        connection.release();

        res.status(201).json({ 
            msg: "Cita creada exitosamente",
            cita: result.rows[0]
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// --------------------- PUT ---------------------
export const putCita = async (req, res) => {
    try {
        const { id } = req.params;
        const { paciente_id, medico_id, fecha_cita, motivo, estado, tipo } = req.body;

        // Validamos los datos obligatorios
        if (!paciente_id || !medico_id || !fecha_cita || !estado || !tipo) {
            return res.status(400).json({ msg: "Bad Request. Please fill all required fields." });
        }

        // Validamos el estado
        if (!['Pendiente', 'Completada', 'Cancelada'].includes(estado)) {
            return res.status(400).json({ msg: "Estado inválido. Debe ser: Pendiente, Completada o Cancelada" });
        }

        // Validamos el tipo
        if (!['Primera', 'Reconsulta'].includes(tipo)) {
            return res.status(400).json({ msg: "Tipo inválido. Debe ser: Primera o Reconsulta" });
        }

        // Obtenemos la conexion
        const connection = await getConnection();

        // Ejecutamos la consulta
        await connection.query(querysCitas.putCita, [
            paciente_id,
            medico_id,
            fecha_cita,
            motivo || null,
            estado,
            tipo,
            id
        ]);

        // Liberamos la conexion
        connection.release();

        res.json({ msg: "Cita actualizada exitosamente" });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// --------------------- DELETE ---------------------
export const deleteCita = async (req, res) => {
    try {
        const { id } = req.params;

        // Obtenemos la conexion
        const connection = await getConnection();

        // Ejecutamos la consulta
        const result = await connection.query(querysCitas.deleteCita, [id]);

        // Liberamos la conexion
        connection.release();

        if (result.rowCount === 0) {
            return res.status(404).json({ msg: "Cita no encontrada" });
        }

        res.json({ msg: "Cita eliminada exitosamente" });
    } catch (error) {
        res.status(500).send(error.message);
    }
};
