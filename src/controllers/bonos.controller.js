import { getConnection, querysBonos } from "../database/index.js";

// --------------------- ENDPOINT PRINCIPAL PARA CRON JOB ---------------------
// Este endpoint será llamado desde AWS Lambda/EventBridge
export const asignarBonosAutomatico = async (req, res) => {
    const client = await getConnection();
    
    try {
        await client.query('BEGIN'); // Iniciar transacción
        
        // 1. Obtener médicos con más de 50 pacientes únicos desde el lunes
        const resultMedicos = await client.query(querysBonos.getMedicosConMasDe50Pacientes);
        
        if (resultMedicos.rows.length === 0) {
            await client.query('COMMIT');
            client.release();
            return res.json({
                msg: "No hay médicos que califiquen para bono esta semana",
                medicosEvaluados: 0,
                bonosAsignados: 0
            });
        }

        const bonosAsignados = [];
        const medicosYaConBono = [];
        const medicosNuevoBono = [];
        
        // 2. Por cada médico que califique, verificar si ya tiene bono esta semana
        for (const medico of resultMedicos.rows) {
            // Verificar si ya tiene bono asignado esta semana
            const resultVerificar = await client.query(
                querysBonos.verificarBonoSemana, 
                [medico.medico_id]
            );
            
            if (resultVerificar.rows.length > 0) {
                // Ya tiene bono esta semana, no asignar otro
                medicosYaConBono.push({
                    medico_id: medico.medico_id,
                    nombre: `${medico.nombre} ${medico.apellido}`,
                    total_pacientes: medico.total_pacientes,
                    bono_existente: resultVerificar.rows[0].monto
                });
            } else {
                // Calcular monto del bono (puede ser fijo o basado en cantidad de pacientes)
                // Ejemplo: $500 base + $10 por cada paciente adicional sobre 50
                const montoBono = 500 + ((medico.total_pacientes - 50) * 10);
                
                // Asignar bono
                const resultBono = await client.query(
                    querysBonos.insertBono,
                    [medico.medico_id, montoBono, new Date()]
                );
                
                bonosAsignados.push(resultBono.rows[0]);
                medicosNuevoBono.push({
                    medico_id: medico.medico_id,
                    nombre: `${medico.nombre} ${medico.apellido}`,
                    especialidad: medico.especialidad,
                    total_pacientes: medico.total_pacientes,
                    monto_bono: montoBono
                });
            }
        }

        await client.query('COMMIT'); // Confirmar transacción
        client.release();

        // 3. Responder con resumen de la operación
        res.status(200).json({
            msg: "Proceso de asignación de bonos completado exitosamente",
            fecha_proceso: new Date(),
            resumen: {
                medicosEvaluados: resultMedicos.rows.length,
                bonosNuevosAsignados: bonosAsignados.length,
                medicosYaConBono: medicosYaConBono.length
            },
            detalles: {
                medicosConNuevoBono: medicosNuevoBono,
                medicosConBonoExistente: medicosYaConBono
            }
        });

    } catch (error) {
        await client.query('ROLLBACK'); // Revertir en caso de error
        client.release();
        console.error("Error en asignación automática de bonos:", error);
        res.status(500).json({
            msg: "Error al asignar bonos automáticamente",
            error: error.message
        });
    }
};

// --------------------- GET - Obtener todos los bonos ---------------------
export const getBonos = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query(querysBonos.getBonos);
        connection.release();
        res.json(result.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// --------------------- GET - Obtener bonos de un médico específico ---------------------
export const getBonosPorMedico = async (req, res) => {
    try {
        const { medico_id } = req.params;
        
        const connection = await getConnection();
        const result = await connection.query(querysBonos.getBonosPorMedico, [medico_id]);
        connection.release();

        res.json({
            medico_id: parseInt(medico_id),
            total_bonos: result.rows.length,
            bonos: result.rows
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// --------------------- POST - Asignar bono manual (opcional) ---------------------
export const asignarBonoManual = async (req, res) => {
    try {
        const { medico_id, monto } = req.body;

        if (!medico_id || !monto) {
            return res.status(400).json({ 
                msg: "Bad Request. Please provide medico_id and monto." 
            });
        }

        if (monto <= 0) {
            return res.status(400).json({ 
                msg: "El monto debe ser mayor a 0" 
            });
        }

        const connection = await getConnection();
        const result = await connection.query(
            querysBonos.insertBono,
            [medico_id, monto, new Date()]
        );
        connection.release();

        res.status(201).json({
            msg: "Bono asignado manualmente con éxito",
            bono: result.rows[0]
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};
