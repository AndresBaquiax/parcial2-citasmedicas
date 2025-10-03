import { getConnection, querysMedicos } from "../database/index.js";

// --------------------- GET ---------------------
export const getMedicos = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query(querysMedicos.getMedicos);
        connection.release();
        res.json(result.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// --------------------- POST ---------------------
export const postMedico = async (req, res) => {
    try {
        const { nombre, apellido, especialidad, telefono } = req.body;

        if (!nombre || !apellido || !especialidad) {
            return res.status(400).json({ msg: "Bad Request. Please fill all required fields." });
        }

        const connection = await getConnection();
        await connection.query(querysMedicos.postMedico, [
            nombre,
            apellido,
            especialidad,
            telefono
        ]);
        connection.release();

        res.json({ msg: "Medico added successfully" });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// --------------------- PUT ---------------------
export const putMedico = async (req, res) => {
    try {
        const { medico_id } = req.params;
        const { nombre, apellido, especialidad, telefono } = req.body;

        if (!nombre || !apellido || !especialidad) {
            return res.status(400).json({ msg: "Bad Request. Please fill all required fields." });
        }

        const connection = await getConnection();
        await connection.query(querysMedicos.putMedico, [
            nombre,
            apellido,
            especialidad,
            telefono,
            medico_id
        ]);
        connection.release();

        res.json({ msg: "Medico updated successfully" });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// --------------------- DELETE ---------------------
export const deleteMedico = async (req, res) => {
    try {
        const { medico_id } = req.params;

        const connection = await getConnection();
        await connection.query(querysMedicos.deleteMedico, [medico_id]);
        connection.release();

        res.json({ msg: "Medico deleted successfully" });
    } catch (error) {
        res.status(500).send(error.message);
    }
};
