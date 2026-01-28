# PoliLims Backend - Django API

Backend robusto y optimizado para el sistema de gestión de laboratorio PoliLims, construido con Django y Django REST Framework.

## 🚀 Características

- **API RESTful** completa con autenticación JWT
- **Modelos robustos** para gestión de ensayos, equipos, proveedores y calidad
- **Tareas asíncronas** con Celery para operaciones pesadas
- **Cache optimizado** con Redis
- **Reportes automáticos** en múltiples formatos
- **Monitoreo** y logging avanzado
- **Escalabilidad** preparada para producción

## 🏗️ Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js       │────│  Django REST    │────│   PostgreSQL    │
│   Frontend      │    │     API         │    │   Database      │
│                 │    │                 │    │                 │
│ • React/TS      │    │ • Business      │    │ • Relational    │
│ • Shadcn UI     │    │   Logic         │    │   Data          │
│ • Tailwind      │ ◄──│ • Validations   │    │ • ACID          │
│ • Charts        │    │ • Reports       │    │   Compliance    │
│ • Real-time UI  │    │ • Workflows     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │     Redis       │
                       │                 │
                       │ • Cache         │
                       │ • Queue         │
                       │ • Sessions      │
                       └─────────────────┘
```

## 📦 Instalación

### Prerrequisitos

- Python 3.11+
- PostgreSQL 14+
- Redis 6+
- Node.js 18+ (para frontend)

### 1. Clonar y configurar

```bash
# Clonar el repositorio
git clone <repository-url>
cd PoliLims/backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# o
venv\Scripts\activate     # Windows

# Instalar dependencias
pip install -r requirements.txt
```

### 2. Configurar variables de entorno

```bash
# Copiar archivo de ejemplo
cp env.example .env

# Editar variables de entorno
nano .env
```

### 3. Configurar base de datos

```bash
# Crear base de datos PostgreSQL
createdb polilims

# Ejecutar migraciones
python manage.py makemigrations
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser
```

### 4. Configurar Redis y Celery

```bash
# Iniciar Redis (en otra terminal)
redis-server

# Iniciar Celery worker
celery -A polilims_backend worker -l info

# Iniciar Celery beat (en otra terminal)
celery -A polilims_backend beat -l info
```

### 5. Ejecutar el servidor

```bash
# Servidor de desarrollo
python manage.py runserver

# Servidor de producción
gunicorn polilims_backend.wsgi:application
```

## 🗄️ Modelos de Datos

### Ensayos
- **Muestra**: Gestión de muestras de material
- **Ensayo**: Ensayos de laboratorio con resultados
- **ResultadoEnsayo**: Resultados detallados de mediciones
- **HistorialEnsayo**: Trazabilidad de cambios

### Equipos
- **Equipo**: Inventario de equipos de laboratorio
- **Calibracion**: Control de calibraciones
- **Mantenimiento**: Programas de mantenimiento
- **ControlEvento**: Eventos de control de equipos

### Proveedores
- **Proveedor**: Gestión de proveedores
- **EvaluacionProveedor**: Evaluaciones de calidad
- **AuditoriaProveedor**: Auditorías de proveedores

### Usuarios
- **User**: Usuario personalizado con roles
- **UserProfile**: Perfil extendido del usuario

## 🔌 API Endpoints

### Autenticación
```
POST /api/auth/login/          # Login
POST /api/auth/logout/         # Logout
POST /api/auth/refresh/        # Refresh token
GET  /api/auth/profile/        # Perfil de usuario
```

### Dashboard
```
GET /api/dashboard/stats/      # Estadísticas generales
GET /api/dashboard/metrics/    # Métricas detalladas
GET /api/dashboard/recent-activity/  # Actividad reciente
```

### Ensayos
```
GET    /api/ensayos/           # Listar ensayos
POST   /api/ensayos/           # Crear ensayo
GET    /api/ensayos/{id}/      # Detalle de ensayo
PUT    /api/ensayos/{id}/      # Actualizar ensayo
DELETE /api/ensayos/{id}/      # Eliminar ensayo
```

### Equipos
```
GET    /api/equipos/           # Listar equipos
POST   /api/equipos/           # Crear equipo
GET    /api/equipos/{id}/      # Detalle de equipo
PUT    /api/equipos/{id}/      # Actualizar equipo
DELETE /api/equipos/{id}/      # Eliminar equipo
```

### Proveedores
```
GET    /api/proveedores/       # Listar proveedores
POST   /api/proveedores/       # Crear proveedor
GET    /api/proveedores/{id}/  # Detalle de proveedor
PUT    /api/proveedores/{id}/  # Actualizar proveedor
DELETE /api/proveedores/{id}/  # Eliminar proveedor
```

## 🔧 Configuración

### Variables de Entorno

```env
# Django
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Base de datos
DB_NAME=polilims
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432

# Redis
REDIS_URL=redis://127.0.0.1:6379/1
CELERY_BROKER_URL=redis://localhost:6379/0

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

### Configuración de Producción

```python
# settings.py
DEBUG = False
ALLOWED_HOSTS = ['your-domain.com']

# Base de datos PostgreSQL
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST'),
        'PORT': config('DB_PORT'),
    }
}

# Cache Redis
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': config('REDIS_URL'),
    }
}
```

## 📊 Tareas Asíncronas

### Tareas Programadas

```python
# Verificaciones diarias
'verificar-calibraciones': {
    'task': 'equipos.tasks.verificar_calibraciones_vencidas',
    'schedule': 86400.0,  # Diario
},

'verificar-mantenimientos': {
    'task': 'equipos.tasks.verificar_mantenimientos_vencidos',
    'schedule': 86400.0,  # Diario
},

# Reportes automáticos
'generar-reportes-diarios': {
    'task': 'reportes.tasks.generar_reporte_diario',
    'schedule': 86400.0,  # Diario
},
```

### Ejecutar Tareas Manualmente

```bash
# Verificar calibraciones
celery -A polilims_backend call equipos.tasks.verificar_calibraciones_vencidas

# Generar reporte
celery -A polilims_backend call reportes.tasks.generar_reporte_diario

# Actualizar métricas
celery -A polilims_backend call polilims_backend.tasks.actualizar_metricas_dashboard
```

## 🔍 Monitoreo y Logging

### Logs

```python
# Configuración de logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'logs/django.log',
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console', 'file'],
        'level': 'INFO',
    },
}
```

### Métricas del Sistema

```python
# Monitoreo de rendimiento
@shared_task
def monitorear_rendimiento_sistema():
    import psutil
    
    metrics = {
        'cpu_percent': psutil.cpu_percent(),
        'memory_percent': psutil.virtual_memory().percent,
        'disk_percent': psutil.disk_usage('/').percent,
    }
    
    cache.set('system_metrics', metrics, timeout=300)
```

## 🧪 Testing

### Ejecutar Tests

```bash
# Tests unitarios
python manage.py test

# Tests con pytest
pytest

# Tests con coverage
pytest --cov=.

# Tests específicos
pytest ensayos/tests/test_models.py
```

### Ejemplo de Test

```python
# tests/test_ensayos.py
import pytest
from django.test import TestCase
from ensayos.models import Ensayo, Muestra

class EnsayoTestCase(TestCase):
    def setUp(self):
        self.muestra = Muestra.objects.create(
            codigo="MUE-001",
            tipo="tuberia_hdpe",
            descripcion="Tubería HDPE de prueba",
            cliente="Cliente Test"
        )
    
    def test_crear_ensayo(self):
        ensayo = Ensayo.objects.create(
            muestra=self.muestra,
            tipo="melt_index",
            descripcion="Ensayo de Melt Index"
        )
        self.assertEqual(ensayo.estado, "pendiente")
        self.assertIsNotNone(ensayo.codigo)
```

## 🚀 Despliegue

### Docker

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
RUN python manage.py collectstatic --noinput

EXPOSE 8000
CMD ["gunicorn", "polilims_backend.wsgi:application"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "8000:8000"
    depends_on:
      - db
      - redis
    environment:
      - DB_HOST=db
      - REDIS_URL=redis://redis:6379/1
  
  db:
    image: postgres:14
    environment:
      - POSTGRES_DB=polilims
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
  
  redis:
    image: redis:6-alpine
  
  celery:
    build: .
    command: celery -A polilims_backend worker -l info
    depends_on:
      - db
      - redis
```

## 📈 Optimización

### Cache

```python
# Cache de consultas frecuentes
from django.core.cache import cache

def get_ensayos_stats():
    cache_key = 'ensayos_stats'
    stats = cache.get(cache_key)
    
    if not stats:
        stats = {
            'total': Ensayo.objects.count(),
            'pendientes': Ensayo.objects.filter(estado='pendiente').count(),
            # ... más estadísticas
        }
        cache.set(cache_key, stats, timeout=3600)
    
    return stats
```

### Consultas Optimizadas

```python
# Select related para evitar N+1 queries
ensayos = Ensayo.objects.select_related(
    'muestra', 'analista', 'supervisor'
).prefetch_related(
    'resultados_detallados'
)

# Anotaciones para agregaciones
from django.db.models import Count, Avg

equipos_stats = Equipo.objects.aggregate(
    total=Count('id'),
    activos=Count('id', filter=Q(estado='activo')),
    promedio_calificacion=Avg('calificacion_general')
)
```

## 🔒 Seguridad

### Autenticación JWT

```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

# JWT Settings
from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
}
```

### Permisos Granulares

```python
# permissions.py
from rest_framework import permissions

class EnsayoPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.can_approve_ensayos()
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.can_approve_ensayos()
```

## 📚 Documentación API

### Swagger/OpenAPI

```python
# urls.py
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]
```

### Ejemplo de Documentación

```python
# views.py
from drf_spectacular.utils import extend_schema, OpenApiParameter

@extend_schema(
    summary="Listar ensayos",
    description="Obtiene una lista paginada de ensayos con filtros opcionales",
    parameters=[
        OpenApiParameter(name="estado", type=str, description="Filtrar por estado"),
        OpenApiParameter(name="tipo", type=str, description="Filtrar por tipo"),
    ],
    responses={200: EnsayoSerializer(many=True)}
)
class EnsayoListView(ListAPIView):
    queryset = Ensayo.objects.all()
    serializer_class = EnsayoSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['estado', 'tipo']
    search_fields = ['codigo', 'descripcion']
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Para soporte técnico o preguntas:

- 📧 Email: soporte@polilims.com
- 📱 Teléfono: +57 300 123 4567
- 🌐 Web: https://polilims.com/soporte

---

**PoliLims Backend** - Sistema de Gestión de Laboratorio de Alta Calidad 🧪
