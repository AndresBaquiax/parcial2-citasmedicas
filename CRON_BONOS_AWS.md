# 🎯 Sistema de Asignación Automática de Bonos

## 📋 Resumen
Endpoint diseñado para ser llamado desde un **Cron Job en AWS** (EventBridge/Lambda) que asigna bonos automáticamente a médicos que hayan atendido más de 50 pacientes únicos desde el lunes.

---

## 🚀 Endpoint Principal para CRON JOB

### **POST** `/bonos/asignar-automatico`

Este es el endpoint que debes configurar en tu AWS Lambda/EventBridge.

#### URL Completa
```
http://tu-servidor:4000/bonos/asignar-automatico
```

#### Método
```
POST
```

#### Headers
```
Content-Type: application/json
```

#### Body
No requiere body. El endpoint ejecuta la lógica automáticamente.

#### Respuesta Exitosa (200)
```json
{
  "msg": "Proceso de asignación de bonos completado exitosamente",
  "fecha_proceso": "2025-10-03T15:30:00.000Z",
  "resumen": {
    "medicosEvaluados": 5,
    "bonosNuevosAsignados": 3,
    "medicosYaConBono": 2
  },
  "detalles": {
    "medicosConNuevoBono": [
      {
        "medico_id": 1,
        "nombre": "Diego Apellido",
        "especialidad": "Cardiologo",
        "total_pacientes": 65,
        "monto_bono": 650.00
      },
      {
        "medico_id": 3,
        "nombre": "María González",
        "especialidad": "Pediatra",
        "total_pacientes": 52,
        "monto_bono": 520.00
      }
    ],
    "medicosConBonoExistente": [
      {
        "medico_id": 2,
        "nombre": "Juan Pérez",
        "total_pacientes": 58,
        "bono_existente": 580.00
      }
    ]
  }
}
```

#### Respuesta cuando no hay médicos que califiquen (200)
```json
{
  "msg": "No hay médicos que califiquen para bono esta semana",
  "medicosEvaluados": 0,
  "bonosAsignados": 0
}
```

---

## 📊 Lógica de Negocio

### Criterios para asignar bono:
1. ✅ Médico debe tener **más de 50 pacientes únicos**
2. ✅ Citas deben ser desde el **lunes de la semana actual**
3. ✅ Solo se cuentan citas con estado **"Completada"**
4. ✅ Se cuentan **pacientes únicos** (no total de citas)
5. ✅ **No se asigna bono duplicado** si el médico ya tiene uno esta semana

### Cálculo del monto del bono:
```
Monto = $500 (base) + ($10 × (pacientes - 50))
```

**Ejemplos:**
- 51 pacientes = $500 + ($10 × 1) = **$510**
- 60 pacientes = $500 + ($10 × 10) = **$600**
- 75 pacientes = $500 + ($10 × 25) = **$750**

---

## ⚙️ Configuración en AWS

### Opción 1: AWS EventBridge + Lambda

#### 1. Crear función Lambda (Node.js)
```javascript
// lambda-handler.js
const https = require('https');

exports.handler = async (event) => {
    const options = {
        hostname: 'tu-servidor.com', // o IP de tu servidor
        port: 4000,
        path: '/bonos/asignar-automatico',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                console.log('Respuesta:', data);
                resolve({
                    statusCode: 200,
                    body: data
                });
            });
        });

        req.on('error', (error) => {
            console.error('Error:', error);
            reject(error);
        });

        req.end();
    });
};
```

#### 2. Configurar EventBridge Rule
- **Nombre**: `asignar-bonos-semanales`
- **Descripción**: Asignar bonos a médicos cada lunes
- **Schedule expression (cron)**: 
  ```
  cron(0 9 ? * MON *)
  ```
  _Ejecuta cada lunes a las 9:00 AM UTC_

- **Target**: Lambda function → (tu función)

### Opción 2: Cron expression alternatives

```bash
# Cada lunes a las 8:00 AM
cron(0 8 ? * MON *)

# Cada domingo a las 11:59 PM (fin de semana)
cron(59 23 ? * SUN *)

# Cada día a las 6:00 AM (si quieres ejecutar diario)
cron(0 6 * * ? *)
```

---

## 🔧 Endpoints Adicionales

### 1. GET - Ver todos los bonos
```http
GET /bonos
```

**Respuesta:**
```json
[
  {
    "bono_id": 1,
    "medico_id": 1,
    "monto": 650.00,
    "fecha_asignado": "2025-10-03"
  }
]
```

### 2. GET - Ver bonos de un médico específico
```http
GET /bonos/medico/:medico_id
```

**Ejemplo:**
```http
GET /bonos/medico/1
```

**Respuesta:**
```json
{
  "medico_id": 1,
  "total_bonos": 3,
  "bonos": [
    {
      "bono_id": 5,
      "medico_id": 1,
      "monto": 650.00,
      "fecha_asignado": "2025-10-03"
    },
    {
      "bono_id": 2,
      "medico_id": 1,
      "monto": 520.00,
      "fecha_asignado": "2025-09-26"
    }
  ]
}
```

### 3. POST - Asignar bono manual
```http
POST /bonos/asignar-manual
Content-Type: application/json

{
  "medico_id": 1,
  "monto": 1000
}
```

**Respuesta:**
```json
{
  "msg": "Bono asignado manualmente con éxito",
  "bono": {
    "bono_id": 10,
    "medico_id": 1,
    "monto": 1000.00,
    "fecha_asignado": "2025-10-03"
  }
}
```

---

## 🧪 Pruebas Locales

### Simular el cron job manualmente
```bash
curl -X POST http://localhost:4000/bonos/asignar-automatico \
  -H "Content-Type: application/json"
```

### Ver bonos asignados
```bash
curl http://localhost:4000/bonos
```

### Ver bonos de un médico
```bash
curl http://localhost:4000/bonos/medico/1
```

---

## 📝 Consulta SQL Utilizada

El sistema usa esta query para identificar médicos elegibles:

```sql
SELECT 
    m.medico_id,
    m.nombre,
    m.apellido,
    m.especialidad,
    COUNT(DISTINCT c.paciente_id) as total_pacientes
FROM Medicos m
INNER JOIN Citas c ON m.medico_id = c.medico_id
WHERE c.fecha_cita >= date_trunc('week', CURRENT_DATE) -- Desde el lunes
AND c.estado = 'Completada'
GROUP BY m.medico_id, m.nombre, m.apellido, m.especialidad
HAVING COUNT(DISTINCT c.paciente_id) > 50
```

---

## ✅ Características Implementadas

✅ **Transacciones**: Usa BEGIN/COMMIT/ROLLBACK para atomicidad  
✅ **Prevención de duplicados**: No asigna bono si ya existe uno esta semana  
✅ **Cálculo automático**: Monto basado en cantidad de pacientes  
✅ **Solo citas completadas**: No cuenta citas pendientes o canceladas  
✅ **Pacientes únicos**: Cuenta pacientes distintos, no total de citas  
✅ **Logs detallados**: Respuesta con detalles de todos los médicos evaluados  
✅ **Manejo de errores**: Rollback automático en caso de fallo  

---

## 🔐 Seguridad (Recomendaciones)

Para producción, considera agregar:

1. **API Key** en headers
```javascript
// En bonos.controller.js
const API_KEY = process.env.CRON_API_KEY;
if (req.headers['x-api-key'] !== API_KEY) {
    return res.status(401).json({ msg: "Unauthorized" });
}
```

2. **IP Whitelist** (solo permitir IPs de AWS)

3. **Rate limiting** para prevenir abuso

---

## 📞 Soporte

- Endpoint principal: `POST /bonos/asignar-automatico`
- Puerto: `4000`
- Requiere: Base de datos PostgreSQL con las tablas creadas
- Timezone: UTC (ajustar según necesites)

---

## 🎉 ¡Listo para usar!

El endpoint está configurado y listo para ser llamado desde tu Cron Job en AWS.
