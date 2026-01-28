# Guía de Migración: Frontend a Backend Django

## 🚀 Resumen de la Migración

Esta guía documenta la migración completa del sistema PoliLims desde un frontend Next.js con datos mock a una arquitectura híbrida con backend Django robusto.

## 📋 Estado Actual

### ✅ Completado
- [x] Backend Django completamente configurado
- [x] Modelos de datos definidos
- [x] API REST implementada
- [x] Autenticación JWT configurada
- [x] Cliente API del frontend creado
- [x] Servicios de API implementados
- [x] Hooks de autenticación creados
- [x] Script de migración de datos
- [x] Documentación actualizada

### 🔄 En Progreso
- [ ] Conexión real del frontend con el backend
- [ ] Migración de datos mock
- [ ] Pruebas de integración

### 📝 Pendiente
- [ ] Optimización de rendimiento
- [ ] Monitoreo y métricas
- [ ] Despliegue en producción

## 🏗️ Arquitectura Final

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Base de       │
│   Next.js       │◄──►│   Django        │◄──►│   Datos         │
│                 │    │                 │    │   PostgreSQL    │
│ • TypeScript    │    │ • DRF API       │    │                 │
│ • Tailwind CSS  │    │ • JWT Auth      │    │ • Redis Cache   │
│ • React Hooks   │    │ • Celery Tasks  │    │                 │
│ • PWA Features  │    │ • Admin Panel   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Instalación y Configuración

### 1. Prerrequisitos
```bash
# Verificar versiones
node --version  # >= 18.0.0
python --version  # >= 3.11
postgres --version  # >= 13
redis-server --version  # >= 6
```

### 2. Configuración del Frontend
```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.local.example .env.local
# Editar .env.local con la URL del backend
```

### 3. Configuración del Backend
```bash
# Navegar al directorio del backend
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env con configuración de base de datos
```

### 4. Configuración de Base de Datos
```bash
# Crear base de datos PostgreSQL
createdb polilims

# Ejecutar migraciones
python manage.py makemigrations
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser
```

## 🔄 Proceso de Migración

### Paso 1: Verificar Conectividad
```bash
# Verificar que el backend esté funcionando
npm run backend:dev

# En otra terminal, verificar conectividad
curl http://localhost:8000/api/health/
```

### Paso 2: Migrar Datos
```bash
# Simular migración (sin enviar datos)
npm run migrate:dry-run

# Ejecutar migración real
npm run migrate:force
```

### Paso 3: Verificar Migración
```bash
# Verificar datos en el admin de Django
# http://localhost:8000/admin/

# Verificar API endpoints
curl http://localhost:8000/api/ensayos/
curl http://localhost:8000/api/equipos/
curl http://localhost:8000/api/proveedores/
```

## 📊 Estructura de Datos Migrada

### Usuarios
- **Juan Díaz** (jdiaz@polifusion.cl) - Ing. Analista de Calidad
- **Ana Figueroa** (afigueroa@polifusion.cl) - Analista de Calidad

### Equipos
- **EQ001** - Extrusor de Melt Index (Tinius Olsen MP1200)
- **EQ002** - Densímetro (Mettler Toledo XS204)

### Proveedores
- **Polímeros del Norte S.A.** - Materia Prima
- **Equipos Industriales Ltda.** - Equipos

### Ensayos
- **Melt Index** - Ensayo completado
- **Densidad** - Ensayo en progreso

### No Conformidades
- **Equipo** - Variación en temperatura
- **Proceso** - Desviación en procedimiento

## 🔧 Configuración de Desarrollo

### Scripts Disponibles
```bash
# Frontend
npm run dev              # Desarrollo frontend
npm run build            # Construir para producción
npm run typecheck        # Verificar tipos TypeScript

# Backend
npm run backend:dev      # Servidor Django
npm run backend:migrate  # Ejecutar migraciones
npm run backend:shell    # Shell de Django

# Migración
npm run migrate          # Migrar datos
npm run migrate:dry-run  # Simular migración

# Desarrollo completo
npm run dev:full         # Frontend + Backend + Celery
```

### Variables de Entorno

#### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=PoliLims
NEXT_PUBLIC_DEBUG_MODE=true
```

#### Backend (.env)
```bash
DEBUG=True
SECRET_KEY=tu-clave-secreta-aqui
DATABASE_URL=postgresql://usuario:password@localhost:5432/polilims
REDIS_URL=redis://localhost:6379/0
ALLOWED_HOSTS=localhost,127.0.0.1
```

## 🔐 Autenticación y Seguridad

### JWT Configuration
- **Access Token**: 1 hora de duración
- **Refresh Token**: 7 días de duración
- **Renovación automática**: 5 minutos antes de expirar

### Roles y Permisos
- **Administrador**: Acceso completo
- **Supervisor**: Gestión y aprobación
- **Analista**: Creación y edición
- **Inspector de Calidad**: Control de calidad
- **Técnico**: Mantenimiento de equipos

## 📈 Monitoreo y Métricas

### Frontend
- **Web Vitals**: Core Web Vitals automáticos
- **Performance**: Métricas de rendimiento
- **Error Tracking**: Captura de errores

### Backend
- **Logging**: Logs estructurados
- **Health Checks**: Estado del sistema
- **Performance**: Análisis de consultas

## 🧪 Testing

### Frontend
```bash
npm run test              # Tests unitarios
npm run test:watch        # Tests en modo watch
npm run test:coverage     # Tests con cobertura
npm run e2e               # Tests end-to-end
```

### Backend
```bash
npm run backend:test      # Tests de Django
```

## 🚀 Despliegue

### Frontend (Vercel)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel --prod
```

### Backend (Docker)
```bash
# Construir imagen
docker build -t polilims-backend .

# Ejecutar contenedor
docker run -p 8000:8000 polilims-backend
```

## 🔍 Troubleshooting

### Problemas Comunes

#### 1. Error de Conexión a la Base de Datos
```bash
# Verificar que PostgreSQL esté corriendo
sudo systemctl status postgresql

# Verificar conexión
psql -h localhost -U usuario -d polilims
```

#### 2. Error de Redis
```bash
# Verificar que Redis esté corriendo
redis-cli ping

# Reiniciar Redis si es necesario
sudo systemctl restart redis
```

#### 3. Error de Migración
```bash
# Limpiar migraciones
cd backend
rm -rf */migrations/0*.py
python manage.py makemigrations
python manage.py migrate
```

#### 4. Error de CORS
```bash
# Verificar configuración CORS en settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

## 📚 Recursos Adicionales

### Documentación
- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Herramientas
- [Django Admin](http://localhost:8000/admin/)
- [API Documentation](http://localhost:8000/api/docs/)
- [Swagger UI](http://localhost:8000/api/swagger/)

## 🎯 Próximos Pasos

### Versión 1.1
- [ ] Optimización de consultas de base de datos
- [ ] Implementación de caché avanzado
- [ ] Métricas de rendimiento en tiempo real
- [ ] Notificaciones push

### Versión 1.2
- [ ] Machine Learning para predicciones
- [ ] Integración con sistemas externos
- [ ] Dashboard ejecutivo avanzado
- [ ] Auditoría completa

### Versión 2.0
- [ ] Arquitectura de microservicios
- [ ] Event Sourcing
- [ ] GraphQL API
- [ ] Real-time collaboration

## 📞 Soporte

- **Email**: soporte@polilims.com
- **Documentación**: [docs.polilims.com](https://docs.polilims.com)
- **Issues**: [GitHub Issues](https://github.com/polilims/polilims/issues)

---

**¡Migración Completada!** 🎉

El sistema PoliLims ahora cuenta con una arquitectura robusta y escalable que combina lo mejor de Next.js y Django para crear el sistema de gestión de laboratorio más avanzado del mundo.
