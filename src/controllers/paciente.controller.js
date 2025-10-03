import { getConnection, querysPacientes } from "../database/index.js";

// --------------------- GET ---------------------
export const getPacientes = async (req, res) => {
    try {
        // Obtenemos la conexion
        const connection = await getConnection();
        const result = await connection.query(querysPacientes.getPacientes);
        // Liberamos la conexion
        connection.release();
        res.json(result.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// --------------------- POST ---------------------
export const postPaciente = async (req, res) => {
    try {
        const { nombre, apellido, telefono, email, cargo } = req.body;

        // Validamos los datos
        if (!nombre || !apellido || !telefono || !email || !cargo) {
            return res.status(400).json({ msg: "Bad Request. Please fill all fields." });
        }

        // Obtenemos la conexion
        const Paciente = await getConnection();

        // Ejecutamos la consulta
        await Paciente.query(querysPacientes.postPaciente, [
            nombre,
            apellido,
            telefono,
            email,
            cargo
        ]);

        // Liberamos la conexion
        Paciente.release();

        res.json({ msg: "Employee added successfully" });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// --------------------- PUT ---------------------
export const putPaciente = async (req, res) => {
    try {
        const { idPaciente } = req.params;
        const { nombre, apellido, telefono, email, cargo } = req.body;

        // Validamos los datos
        if (!nombre || !apellido || !telefono || !email || !cargo) {
            return res.status(400).json({ msg: "Bad Request. Please fill all fields." });
        }

        // Obtenemos la conexion
        const Paciente = await getConnection();

        // Ejecutamos la consulta
        await Paciente.query(querysPacientes.putPaciente, [
            nombre,
            apellido,
            telefono,
            email,
            cargo,
            idPaciente
        ]);

        // Liberamos la conexion
        Paciente.release();

        res.json({ msg: "Employee updated successfully" });
    } catch (error) {
        res.status(500).send(error.message);
    }
};
