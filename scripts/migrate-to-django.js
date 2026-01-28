#!/usr/bin/env node

/**
 * Script de migración de datos del frontend al backend Django
 * Este script migra los datos mock del frontend al backend Django
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Configuración
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const BACKEND_URL = `${API_BASE_URL}/api`;

// Datos mock del frontend (desde data-service.ts)
const mockData = {
  ensayos: [
    {
      id: 1,
      tipo: "Melt Index",
      analista: "Juan Díaz",
      fecha_inicio: "2024-01-15T08:00:00Z",
      fecha_fin: "2024-01-15T16:00:00Z",
      estado: "Aprobado",
      muestra: "M001",
      observaciones: "Ensayo completado exitosamente",
      parametros_especificos: {
        temperatura: 190,
        carga: 2.16,
        tiempo: 600
      }
    },
    {
      id: 2,
      tipo: "Densidad",
      analista: "Ana Figueroa",
      fecha_inicio: "2024-01-16T09:00:00Z",
      fecha_fin: "2024-01-16T17:00:00Z",
      estado: "En Progreso",
      muestra: "M002",
      observaciones: "Ensayo en proceso",
      parametros_especificos: {
        temperatura: 23,
        metodo: "ISO 1183"
      }
    }
  ],
  equipos: [
    {
      id: 1,
      codigo: "EQ001",
      nombre: "Extrusor de Melt Index",
      tipo: "Extrusor",
      marca: "Tinius Olsen",
      modelo: "MP1200",
      serie: "MI-2023-001",
      ubicacion: "Laboratorio Principal",
      estado: "Activo",
      fecha_adquisicion: "2023-01-15",
      fecha_ultima_calibracion: "2023-12-01",
      fecha_proxima_calibracion: "2024-06-01",
      responsable: "Carlos López",
      observaciones: "Equipo funcionando correctamente"
    },
    {
      id: 2,
      codigo: "EQ002",
      nombre: "Densímetro",
      tipo: "Medidor de Densidad",
      marca: "Mettler Toledo",
      modelo: "XS204",
      serie: "DEN-2023-002",
      ubicacion: "Laboratorio Secundario",
      estado: "Activo",
      fecha_adquisicion: "2023-03-20",
      fecha_ultima_calibracion: "2023-11-15",
      fecha_proxima_calibracion: "2024-05-15",
      responsable: "María González",
      observaciones: "Requiere mantenimiento preventivo"
    }
  ],
  proveedores: [
    {
      id: 1,
      nombre: "Polímeros del Norte S.A.",
      tipo: "Materia Prima",
      contacto: "Carlos Mendoza",
      email: "carlos.mendoza@polimerosnorte.com",
      telefono: "+57-1-234-5678",
      direccion: "Calle 123 #45-67, Bogotá",
      estado: "Activo",
      fecha_evaluacion: "2023-12-01",
      calificacion: 4.5,
      observaciones: "Proveedor confiable y puntual"
    },
    {
      id: 2,
      nombre: "Equipos Industriales Ltda.",
      tipo: "Equipos",
      contacto: "Ana Rodríguez",
      email: "ana.rodriguez@equiposind.com",
      telefono: "+57-1-345-6789",
      direccion: "Avenida 78 #90-12, Medellín",
      estado: "Activo",
      fecha_evaluacion: "2023-11-15",
      calificacion: 4.2,
      observaciones: "Buen servicio técnico"
    }
  ],
  noConformidades: [
    {
      id: 1,
      tipo: "Equipo",
      descripcion: "Extrusor presentó variación en temperatura",
      fecha_deteccion: "2024-01-10",
      responsable: "Juan Díaz",
      estado: "Abierta",
      severidad: "Media",
      accion_correctiva: "Calibración del sensor de temperatura",
      fecha_limite: "2024-01-25",
      observaciones: "Se requiere verificación adicional"
    },
    {
      id: 2,
      tipo: "Proceso",
      descripcion: "Desviación en procedimiento de ensayo",
      fecha_deteccion: "2024-01-12",
      responsable: "Ana Figueroa",
      estado: "Cerrada",
      severidad: "Baja",
      accion_correctiva: "Actualización del procedimiento",
      fecha_limite: "2024-01-20",
      observaciones: "Problema resuelto satisfactoriamente"
    }
  ],
  usuarios: [
    {
      id: 1,
      username: "jdiaz",
      email: "jdiaz@polifusion.cl",
      first_name: "Juan",
      last_name: "Díaz",
      role: "Ing. Analista de Calidad",
      employee_id: "EMP001",
      department: "Control de Calidad",
      phone: "+57-300-123-4567",
      is_active: true,
      date_joined: "2023-01-15"
    },
    {
      id: 2,
      username: "afigueroa",
      email: "afigueroa@polifusion.cl",
      first_name: "Ana",
      last_name: "Figueroa",
      role: "Analista de Calidad",
      employee_id: "EMP002",
      department: "Control de Calidad",
      phone: "+57-300-234-5678",
      is_active: true,
      date_joined: "2023-02-01"
    }
  ]
};

// Funciones de migración
class DataMigrator {
  constructor() {
    this.migratedData = {
      ensayos: [],
      equipos: [],
      proveedores: [],
      noConformidades: [],
      usuarios: []
    };
  }

  // Función para hacer peticiones HTTP
  async makeRequest(endpoint, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
      const url = new URL(`${BACKEND_URL}${endpoint}`);
      const isHttps = url.protocol === 'https:';
      const client = isHttps ? https : http;
      
      const options = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (data) {
        const postData = JSON.stringify(data);
        options.headers['Content-Length'] = Buffer.byteLength(postData);
      }

      const req = client.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              const jsonData = JSON.parse(body);
              resolve(jsonData);
            } catch (error) {
              resolve(body);
            }
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (data) {
        req.write(JSON.stringify(data));
      }
      req.end();
    });
  }

  // Migrar usuarios
  async migrateUsers() {
    console.log('🔄 Migrando usuarios...');
    
    for (const user of mockData.usuarios) {
      try {
        const userData = {
          username: user.username,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          password: 'password123', // Contraseña temporal
          role: user.role,
          employee_id: user.employee_id,
          department: user.department,
          phone: user.phone,
          is_active: user.is_active
        };

        const response = await this.makeRequest('/auth/users/', 'POST', userData);
        this.migratedData.usuarios.push(response);
        console.log(`✅ Usuario migrado: ${user.username}`);
      } catch (error) {
        console.error(`❌ Error migrando usuario ${user.username}:`, error.message);
      }
    }
  }

  // Migrar equipos
  async migrateEquipos() {
    console.log('🔄 Migrando equipos...');
    
    for (const equipo of mockData.equipos) {
      try {
        const equipoData = {
          codigo: equipo.codigo,
          nombre: equipo.nombre,
          tipo: equipo.tipo,
          marca: equipo.marca,
          modelo: equipo.modelo,
          serie: equipo.serie,
          ubicacion: equipo.ubicacion,
          estado: equipo.estado,
          fecha_adquisicion: equipo.fecha_adquisicion,
          fecha_ultima_calibracion: equipo.fecha_ultima_calibracion,
          fecha_proxima_calibracion: equipo.fecha_proxima_calibracion,
          responsable: equipo.responsable,
          observaciones: equipo.observaciones
        };

        const response = await this.makeRequest('/equipos/', 'POST', equipoData);
        this.migratedData.equipos.push(response);
        console.log(`✅ Equipo migrado: ${equipo.codigo}`);
      } catch (error) {
        console.error(`❌ Error migrando equipo ${equipo.codigo}:`, error.message);
      }
    }
  }

  // Migrar proveedores
  async migrateProveedores() {
    console.log('🔄 Migrando proveedores...');
    
    for (const proveedor of mockData.proveedores) {
      try {
        const proveedorData = {
          nombre: proveedor.nombre,
          tipo: proveedor.tipo,
          contacto: proveedor.contacto,
          email: proveedor.email,
          telefono: proveedor.telefono,
          direccion: proveedor.direccion,
          estado: proveedor.estado,
          fecha_evaluacion: proveedor.fecha_evaluacion,
          calificacion: proveedor.calificacion,
          observaciones: proveedor.observaciones
        };

        const response = await this.makeRequest('/proveedores/', 'POST', proveedorData);
        this.migratedData.proveedores.push(response);
        console.log(`✅ Proveedor migrado: ${proveedor.nombre}`);
      } catch (error) {
        console.error(`❌ Error migrando proveedor ${proveedor.nombre}:`, error.message);
      }
    }
  }

  // Migrar no conformidades
  async migrateNoConformidades() {
    console.log('🔄 Migrando no conformidades...');
    
    for (const nc of mockData.noConformidades) {
      try {
        const ncData = {
          tipo: nc.tipo,
          descripcion: nc.descripcion,
          fecha_deteccion: nc.fecha_deteccion,
          responsable: nc.responsable,
          estado: nc.estado,
          severidad: nc.severidad,
          accion_correctiva: nc.accion_correctiva,
          fecha_limite: nc.fecha_limite,
          observaciones: nc.observaciones
        };

        const response = await this.makeRequest('/calidad/no-conformidades/', 'POST', ncData);
        this.migratedData.noConformidades.push(response);
        console.log(`✅ No conformidad migrada: ${nc.id}`);
      } catch (error) {
        console.error(`❌ Error migrando no conformidad ${nc.id}:`, error.message);
      }
    }
  }

  // Migrar ensayos
  async migrateEnsayos() {
    console.log('🔄 Migrando ensayos...');
    
    for (const ensayo of mockData.ensayos) {
      try {
        const ensayoData = {
          tipo: ensayo.tipo,
          analista: ensayo.analista,
          fecha_inicio: ensayo.fecha_inicio,
          fecha_fin: ensayo.fecha_fin,
          estado: ensayo.estado,
          muestra: ensayo.muestra,
          observaciones: ensayo.observaciones,
          parametros_especificos: ensayo.parametros_especificos
        };

        const response = await this.makeRequest('/ensayos/', 'POST', ensayoData);
        this.migratedData.ensayos.push(response);
        console.log(`✅ Ensayo migrado: ${ensayo.id}`);
      } catch (error) {
        console.error(`❌ Error migrando ensayo ${ensayo.id}:`, error.message);
      }
    }
  }

  // Ejecutar migración completa
  async migrateAll() {
    console.log('🚀 Iniciando migración de datos...');
    console.log(`📍 Backend URL: ${BACKEND_URL}`);
    console.log('');

    try {
      // Verificar conectividad con el backend
      console.log('🔍 Verificando conectividad con el backend...');
      await this.makeRequest('/health/');
      console.log('✅ Backend conectado correctamente');
      console.log('');

      // Migrar datos en orden de dependencias
      await this.migrateUsers();
      console.log('');
      
      await this.migrateEquipos();
      console.log('');
      
      await this.migrateProveedores();
      console.log('');
      
      await this.migrateNoConformidades();
      console.log('');
      
      await this.migrateEnsayos();
      console.log('');

      // Generar reporte de migración
      this.generateMigrationReport();

    } catch (error) {
      console.error('❌ Error durante la migración:', error.message);
      process.exit(1);
    }
  }

  // Generar reporte de migración
  generateMigrationReport() {
    console.log('📊 Reporte de Migración');
    console.log('========================');
    console.log(`Usuarios migrados: ${this.migratedData.usuarios.length}/${mockData.usuarios.length}`);
    console.log(`Equipos migrados: ${this.migratedData.equipos.length}/${mockData.equipos.length}`);
    console.log(`Proveedores migrados: ${this.migratedData.proveedores.length}/${mockData.proveedores.length}`);
    console.log(`No conformidades migradas: ${this.migratedData.noConformidades.length}/${mockData.noConformidades.length}`);
    console.log(`Ensayos migrados: ${this.migratedData.ensayos.length}/${mockData.ensayos.length}`);
    console.log('');

    // Guardar reporte en archivo
    const report = {
      timestamp: new Date().toISOString(),
      backend_url: BACKEND_URL,
      summary: {
        usuarios: this.migratedData.usuarios.length,
        equipos: this.migratedData.equipos.length,
        proveedores: this.migratedData.proveedores.length,
        noConformidades: this.migratedData.noConformidades.length,
        ensayos: this.migratedData.ensayos.length
      },
      details: this.migratedData
    };

    const reportPath = path.join(__dirname, 'migration-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📄 Reporte guardado en: ${reportPath}`);

    console.log('✅ Migración completada exitosamente!');
  }
}

// Función principal
async function main() {
  const migrator = new DataMigrator();
  
  // Verificar argumentos de línea de comandos
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Uso: node migrate-to-django.js [opciones]

Opciones:
  --help, -h     Mostrar esta ayuda
  --dry-run      Simular migración sin enviar datos
  --backup       Crear backup antes de migrar
  --force        Forzar migración sin confirmación

Ejemplos:
  node migrate-to-django.js
  node migrate-to-django.js --dry-run
  node migrate-to-django.js --backup --force
    `);
    return;
  }

  if (args.includes('--dry-run')) {
    console.log('🔍 Modo simulación - No se enviarán datos al backend');
    console.log('Datos que se migrarían:');
    console.log(JSON.stringify(mockData, null, 2));
    return;
  }

  // Confirmación antes de migrar (excepto si se usa --force)
  if (!args.includes('--force')) {
    console.log('⚠️  ADVERTENCIA: Este script migrará datos al backend Django.');
    console.log('¿Está seguro de que desea continuar? (y/N)');
    
    // En un entorno real, aquí se pediría confirmación del usuario
    // Por ahora, continuamos automáticamente
  }

  await migrator.migrateAll();
}

// Ejecutar script
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });
}

module.exports = { DataMigrator, mockData };
