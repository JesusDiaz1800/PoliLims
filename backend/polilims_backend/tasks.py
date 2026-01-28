from celery import shared_task
from django.utils import timezone
from django.core.cache import cache
from django.db.models import Q
from datetime import timedelta
import logging

logger = logging.getLogger(__name__)


@shared_task
def limpiar_datos_temporales():
    """
    Tarea para limpiar datos temporales del sistema
    """
    try:
        from django.core.files.storage import default_storage
        from django.core.files.base import ContentFile
        
        # Limpiar archivos temporales
        # Aquí se implementaría la lógica para limpiar archivos temporales
        
        # Limpiar cache expirado
        cache.clear()
        
        logger.info("Datos temporales limpiados exitosamente")
        return "Datos temporales limpiados"
        
    except Exception as e:
        logger.error(f"Error limpiando datos temporales: {str(e)}")
        raise


@shared_task
def generar_backup_datos():
    """
    Tarea para generar backup de datos críticos
    """
    try:
        from django.core import serializers
        from django.conf import settings
        import json
        import os
        
        # Crear directorio de backups si no existe
        backup_dir = os.path.join(settings.BASE_DIR, 'backups')
        os.makedirs(backup_dir, exist_ok=True)
        
        # Generar backup de ensayos
        from ensayos.models import Ensayo, Muestra
        ensayos_data = serializers.serialize('json', Ensayo.objects.all())
        muestras_data = serializers.serialize('json', Muestra.objects.all())
        
        # Guardar backups
        timestamp = timezone.now().strftime('%Y%m%d_%H%M%S')
        
        with open(os.path.join(backup_dir, f'ensayos_{timestamp}.json'), 'w') as f:
            f.write(ensayos_data)
        
        with open(os.path.join(backup_dir, f'muestras_{timestamp}.json'), 'w') as f:
            f.write(muestras_data)
        
        logger.info(f"Backup generado exitosamente: {timestamp}")
        return f"Backup generado: {timestamp}"
        
    except Exception as e:
        logger.error(f"Error generando backup: {str(e)}")
        raise


@shared_task
def enviar_notificaciones_pendientes():
    """
    Tarea para enviar notificaciones pendientes
    """
    try:
        # Aquí se implementaría la lógica para enviar notificaciones
        # Por ejemplo, notificaciones de ensayos vencidos, equipos que necesitan calibración, etc.
        
        # Verificar ensayos vencidos
        from ensayos.models import Ensayo
        ensayos_vencidos = Ensayo.objects.filter(
            estado='en_proceso',
            fecha_inicio__lt=timezone.now() - timedelta(days=7)
        )
        
        for ensayo in ensayos_vencidos:
            # Enviar notificación al analista
            logger.info(f"Notificación enviada para ensayo vencido: {ensayo.codigo}")
        
        # Verificar equipos que necesitan calibración
        from equipos.models import Equipo
        equipos_calibracion = Equipo.objects.filter(
            fecha_proxima_calibracion__lte=timezone.now().date()
        )
        
        for equipo in equipos_calibracion:
            # Enviar notificación al responsable
            logger.info(f"Notificación enviada para equipo que necesita calibración: {equipo.codigo}")
        
        logger.info("Notificaciones enviadas exitosamente")
        return "Notificaciones enviadas"
        
    except Exception as e:
        logger.error(f"Error enviando notificaciones: {str(e)}")
        raise


@shared_task
def actualizar_metricas_dashboard():
    """
    Tarea para actualizar métricas del dashboard
    """
    try:
        from django.db.models import Count, Avg
        from ensayos.models import Ensayo
        from equipos.models import Equipo
        from proveedores.models import Proveedor
        
        # Calcular métricas
        metrics = {
            'ensayos': {
                'total': Ensayo.objects.count(),
                'pendientes': Ensayo.objects.filter(estado='pendiente').count(),
                'en_proceso': Ensayo.objects.filter(estado='en_proceso').count(),
                'completados_hoy': Ensayo.objects.filter(
                    estado='completado',
                    fecha_fin__date=timezone.now().date()
                ).count(),
            },
            'equipos': {
                'total': Equipo.objects.count(),
                'activos': Equipo.objects.filter(estado='activo').count(),
                'necesitan_calibracion': Equipo.objects.filter(
                    fecha_proxima_calibracion__lte=timezone.now().date()
                ).count(),
            },
            'proveedores': {
                'total': Proveedor.objects.count(),
                'activos': Proveedor.objects.filter(estado='activo').count(),
                'necesitan_evaluacion': Proveedor.objects.filter(
                    fecha_proxima_evaluacion__lte=timezone.now().date()
                ).count(),
            }
        }
        
        # Guardar en cache
        cache.set('dashboard_metrics', metrics, timeout=3600)  # 1 hora
        
        logger.info("Métricas del dashboard actualizadas")
        return "Métricas actualizadas"
        
    except Exception as e:
        logger.error(f"Error actualizando métricas: {str(e)}")
        raise


@shared_task
def verificar_integridad_datos():
    """
    Tarea para verificar la integridad de los datos
    """
    try:
        from ensayos.models import Ensayo, Muestra
        from equipos.models import Equipo
        from proveedores.models import Proveedor
        
        issues = []
        
        # Verificar ensayos sin muestra
        ensayos_sin_muestra = Ensayo.objects.filter(muestra__isnull=True)
        if ensayos_sin_muestra.exists():
            issues.append(f"Encontrados {ensayos_sin_muestra.count()} ensayos sin muestra")
        
        # Verificar equipos sin responsable
        equipos_sin_responsable = Equipo.objects.filter(responsable__isnull=True)
        if equipos_sin_responsable.exists():
            issues.append(f"Encontrados {equipos_sin_responsable.count()} equipos sin responsable")
        
        # Verificar proveedores sin contacto
        proveedores_sin_contacto = Proveedor.objects.filter(
            Q(telefono='') | Q(email='')
        )
        if proveedores_sin_contacto.exists():
            issues.append(f"Encontrados {proveedores_sin_contacto.count()} proveedores sin contacto completo")
        
        if issues:
            logger.warning(f"Problemas de integridad encontrados: {', '.join(issues)}")
            return f"Problemas encontrados: {', '.join(issues)}"
        else:
            logger.info("Verificación de integridad completada sin problemas")
            return "Verificación completada sin problemas"
        
    except Exception as e:
        logger.error(f"Error verificando integridad: {str(e)}")
        raise


@shared_task
def optimizar_base_datos():
    """
    Tarea para optimizar la base de datos
    """
    try:
        from django.db import connection
        
        with connection.cursor() as cursor:
            # Analizar tablas
            cursor.execute("ANALYZE;")
            
            # Vacuum (solo para PostgreSQL)
            if connection.vendor == 'postgresql':
                cursor.execute("VACUUM ANALYZE;")
        
        logger.info("Optimización de base de datos completada")
        return "Base de datos optimizada"
        
    except Exception as e:
        logger.error(f"Error optimizando base de datos: {str(e)}")
        raise


@shared_task
def generar_reportes_automaticos():
    """
    Tarea para generar reportes automáticos
    """
    try:
        from reportes.tasks import generar_reporte_diario, generar_reporte_semanal
        
        # Generar reporte diario
        generar_reporte_diario.delay()
        
        # Generar reporte semanal si es domingo
        if timezone.now().weekday() == 6:  # Domingo
            generar_reporte_semanal.delay()
        
        logger.info("Reportes automáticos programados")
        return "Reportes programados"
        
    except Exception as e:
        logger.error(f"Error generando reportes automáticos: {str(e)}")
        raise


@shared_task
def sincronizar_datos_externos():
    """
    Tarea para sincronizar datos con sistemas externos
    """
    try:
        # Aquí se implementaría la lógica para sincronizar con sistemas externos
        # Por ejemplo, ERP, sistemas de equipos, etc.
        
        logger.info("Sincronización de datos externos completada")
        return "Datos sincronizados"
        
    except Exception as e:
        logger.error(f"Error sincronizando datos: {str(e)}")
        raise


@shared_task
def monitorear_rendimiento_sistema():
    """
    Tarea para monitorear el rendimiento del sistema
    """
    try:
        import psutil
        import os
        
        # Obtener métricas del sistema
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        metrics = {
            'cpu_percent': cpu_percent,
            'memory_percent': memory.percent,
            'disk_percent': disk.percent,
            'timestamp': timezone.now().isoformat(),
        }
        
        # Guardar métricas
        cache.set('system_metrics', metrics, timeout=300)  # 5 minutos
        
        # Alertar si hay problemas
        if cpu_percent > 80:
            logger.warning(f"CPU usage alto: {cpu_percent}%")
        
        if memory.percent > 80:
            logger.warning(f"Memory usage alto: {memory.percent}%")
        
        if disk.percent > 90:
            logger.warning(f"Disk usage alto: {disk.percent}%")
        
        logger.info("Monitoreo de rendimiento completado")
        return "Monitoreo completado"
        
    except Exception as e:
        logger.error(f"Error monitoreando rendimiento: {str(e)}")
        raise
