import os
from celery import Celery

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'polilims_backend.settings')

app = Celery('polilims_backend')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django apps.
app.autodiscover_tasks()


@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f'Request: {self.request!r}')


# Configuración de tareas específicas para PoliLims
app.conf.update(
    # Configuración de colas
    task_routes={
        'ensayos.tasks.*': {'queue': 'ensayos'},
        'equipos.tasks.*': {'queue': 'equipos'},
        'reportes.tasks.*': {'queue': 'reportes'},
        'calidad.tasks.*': {'queue': 'calidad'},
    },
    
    # Configuración de resultados
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='America/Bogota',
    enable_utc=True,
    
    # Configuración de workers
    worker_prefetch_multiplier=1,
    task_acks_late=True,
    worker_max_tasks_per_child=1000,
    
    # Configuración de beat (tareas programadas)
    beat_schedule={
        'verificar-calibraciones': {
            'task': 'equipos.tasks.verificar_calibraciones_vencidas',
            'schedule': 86400.0,  # Diario
        },
        'verificar-mantenimientos': {
            'task': 'equipos.tasks.verificar_mantenimientos_vencidos',
            'schedule': 86400.0,  # Diario
        },
        'generar-reportes-diarios': {
            'task': 'reportes.tasks.generar_reporte_diario',
            'schedule': 86400.0,  # Diario
        },
        'verificar-evaluaciones-proveedores': {
            'task': 'proveedores.tasks.verificar_evaluaciones_vencidas',
            'schedule': 604800.0,  # Semanal
        },
        'limpiar-datos-temporales': {
            'task': 'polilims_backend.tasks.limpiar_datos_temporales',
            'schedule': 2592000.0,  # Mensual
        },
    },
    
    # Configuración de monitoreo
    worker_send_task_events=True,
    task_send_sent_event=True,
)
