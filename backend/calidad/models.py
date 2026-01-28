from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth import get_user_model
from decimal import Decimal
import uuid
from django.utils import timezone

User = get_user_model()


class NoConformidad(models.Model):
    """
    Modelo para gestión de no conformidades
    """
    TIPO_NC_CHOICES = [
        ('ensayo', 'Ensayo'),
        ('equipo', 'Equipo'),
        ('proveedor', 'Proveedor'),
        ('proceso', 'Proceso'),
        ('documentacion', 'Documentación'),
        ('otro', 'Otro'),
    ]
    
    ESTADO_CHOICES = [
        ('abierta', 'Abierta'),
        ('en_analisis', 'En Análisis'),
        ('accion_correctiva', 'Acción Correctiva'),
        ('verificacion', 'En Verificación'),
        ('cerrada', 'Cerrada'),
        ('rechazada', 'Rechazada'),
    ]
    
    PRIORIDAD_CHOICES = [
        ('alta', 'Alta'),
        ('media', 'Media'),
        ('baja', 'Baja'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    codigo = models.CharField(max_length=50, unique=True, verbose_name=_('Código'))
    titulo = models.CharField(max_length=200, verbose_name=_('Título'))
    descripcion = models.TextField(verbose_name=_('Descripción'))
    
    tipo = models.CharField(max_length=20, choices=TIPO_NC_CHOICES, verbose_name=_('Tipo'))
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='abierta', verbose_name=_('Estado'))
    prioridad = models.CharField(max_length=10, choices=PRIORIDAD_CHOICES, default='media', verbose_name=_('Prioridad'))
    
    # Fechas
    fecha_deteccion = models.DateTimeField(auto_now_add=True, verbose_name=_('Fecha de Detección'))
    fecha_limite = models.DateField(null=True, blank=True, verbose_name=_('Fecha Límite'))
    fecha_cierre = models.DateTimeField(null=True, blank=True, verbose_name=_('Fecha de Cierre'))
    
    # Responsables
    reportado_por = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True,
        related_name='ncs_reportadas', verbose_name=_('Reportado por')
    )
    responsable = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='ncs_responsable', verbose_name=_('Responsable')
    )
    cerrado_por = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='ncs_cerradas', verbose_name=_('Cerrado por')
    )
    
    # Análisis
    causa_raiz = models.TextField(blank=True, verbose_name=_('Causa Raíz'))
    impacto = models.TextField(blank=True, verbose_name=_('Impacto'))
    
    # Acciones
    accion_correctiva = models.TextField(blank=True, verbose_name=_('Acción Correctiva'))
    accion_preventiva = models.TextField(blank=True, verbose_name=_('Acción Preventiva'))
    
    # Verificación
    verificacion_efectividad = models.TextField(blank=True, verbose_name=_('Verificación de Efectividad'))
    costo_estimado = models.DecimalField(
        max_digits=12, decimal_places=2,
        null=True, blank=True, verbose_name=_('Costo Estimado')
    )
    
    # Documentación
    evidencias = models.JSONField(default=list, blank=True, verbose_name=_('Evidencias'))
    documentos = models.JSONField(default=list, blank=True, verbose_name=_('Documentos'))
    
    # Observaciones
    observaciones = models.TextField(blank=True, verbose_name=_('Observaciones'))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Fecha de Creación'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Fecha de Actualización'))
    
    class Meta:
        verbose_name = _('No Conformidad')
        verbose_name_plural = _('No Conformidades')
        ordering = ['-fecha_deteccion']
    
    def __str__(self):
        return f"{self.codigo} - {self.titulo}"
    
    def save(self, *args, **kwargs):
        # Auto-generar código si no existe
        if not self.codigo:
            self.codigo = f"NC-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)
    
    def get_duracion(self):
        """Retorna la duración de la NC en días"""
        if self.fecha_cierre:
            return (self.fecha_cierre - self.fecha_deteccion).days
        return (timezone.now() - self.fecha_deteccion).days
    
    def esta_vencida(self):
        """Verifica si la NC está vencida"""
        if self.fecha_limite:
            return timezone.now().date() > self.fecha_limite
        return False
    
    def puede_cerrar(self):
        """Verifica si la NC puede ser cerrada"""
        return (
            self.estado in ['verificacion'] and
            self.accion_correctiva and
            self.verificacion_efectividad
        )
    
    def cerrar(self, cerrado_por):
        """Cierra la NC"""
        if self.puede_cerrar():
            self.estado = 'cerrada'
            self.cerrado_por = cerrado_por
            self.fecha_cierre = timezone.now()
            self.save()
            return True
        return False


class AccionCorrectiva(models.Model):
    """
    Modelo para acciones correctivas
    """
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('en_proceso', 'En Proceso'),
        ('completada', 'Completada'),
        ('verificada', 'Verificada'),
        ('cancelada', 'Cancelada'),
    ]
    
    no_conformidad = models.ForeignKey(
        NoConformidad, on_delete=models.CASCADE,
        related_name='acciones_correctivas', verbose_name=_('No Conformidad')
    )
    descripcion = models.TextField(verbose_name=_('Descripción'))
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente', verbose_name=_('Estado'))
    
    # Responsables
    responsable = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True,
        related_name='acciones_asignadas', verbose_name=_('Responsable')
    )
    
    # Fechas
    fecha_inicio = models.DateTimeField(null=True, blank=True, verbose_name=_('Fecha de Inicio'))
    fecha_limite = models.DateField(verbose_name=_('Fecha Límite'))
    fecha_completado = models.DateTimeField(null=True, blank=True, verbose_name=_('Fecha Completado'))
    
    # Resultados
    resultado = models.TextField(blank=True, verbose_name=_('Resultado'))
    evidencias = models.JSONField(default=list, blank=True, verbose_name=_('Evidencias'))
    
    # Observaciones
    observaciones = models.TextField(blank=True, verbose_name=_('Observaciones'))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Fecha de Creación'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Fecha de Actualización'))
    
    class Meta:
        verbose_name = _('Acción Correctiva')
        verbose_name_plural = _('Acciones Correctivas')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"AC-{self.no_conformidad.codigo} - {self.descripcion[:50]}"
    
    def esta_vencida(self):
        """Verifica si la acción está vencida"""
        return timezone.now().date() > self.fecha_limite
    
    def completar(self):
        """Marca la acción como completada"""
        self.estado = 'completada'
        self.fecha_completado = timezone.now()
        self.save()


class Auditoria(models.Model):
    """
    Modelo para auditorías internas y externas
    """
    TIPO_AUDITORIA_CHOICES = [
        ('interna', 'Interna'),
        ('externa', 'Externa'),
        ('seguimiento', 'Seguimiento'),
        ('certificacion', 'Certificación'),
    ]
    
    ESTADO_CHOICES = [
        ('programada', 'Programada'),
        ('en_proceso', 'En Proceso'),
        ('completada', 'Completada'),
        ('cancelada', 'Cancelada'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    codigo = models.CharField(max_length=50, unique=True, verbose_name=_('Código'))
    tipo = models.CharField(max_length=20, choices=TIPO_AUDITORIA_CHOICES, verbose_name=_('Tipo'))
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='programada', verbose_name=_('Estado'))
    
    # Alcance
    alcance = models.TextField(verbose_name=_('Alcance'))
    objetivos = models.TextField(verbose_name=_('Objetivos'))
    
    # Fechas
    fecha_programada = models.DateField(verbose_name=_('Fecha Programada'))
    fecha_inicio = models.DateTimeField(null=True, blank=True, verbose_name=_('Fecha de Inicio'))
    fecha_fin = models.DateTimeField(null=True, blank=True, verbose_name=_('Fecha de Finalización'))
    
    # Equipo auditor
    auditor_lider = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True,
        related_name='auditorias_calidad_lideradas', verbose_name=_('Auditor Líder')
    )
    equipo_auditor = models.JSONField(default=list, blank=True, verbose_name=_('Equipo Auditor'))
    
    # Resultados
    hallazgos = models.JSONField(default=list, blank=True, verbose_name=_('Hallazgos'))
    no_conformidades = models.JSONField(default=list, blank=True, verbose_name=_('No Conformidades'))
    observaciones = models.JSONField(default=list, blank=True, verbose_name=_('Observaciones'))
    
    # Documentación
    plan_auditoria = models.FileField(
        upload_to='auditorias/planes/',
        blank=True, null=True, verbose_name=_('Plan de Auditoría')
    )
    reporte_auditoria = models.FileField(
        upload_to='auditorias/reportes/',
        blank=True, null=True, verbose_name=_('Reporte de Auditoría')
    )
    evidencias = models.JSONField(default=list, blank=True, verbose_name=_('Evidencias'))
    
    # Observaciones
    observaciones_generales = models.TextField(blank=True, verbose_name=_('Observaciones Generales'))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Fecha de Creación'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Fecha de Actualización'))
    
    class Meta:
        verbose_name = _('Auditoría')
        verbose_name_plural = _('Auditorías')
        ordering = ['-fecha_programada']
    
    def __str__(self):
        return f"{self.codigo} - {self.get_tipo_display()} - {self.fecha_programada}"
    
    def save(self, *args, **kwargs):
        # Auto-generar código si no existe
        if not self.codigo:
            self.codigo = f"AUD-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)
    
    def get_no_conformidades_count(self):
        """Retorna el número de no conformidades"""
        return len(self.no_conformidades)
    
    def get_hallazgos_count(self):
        """Retorna el número de hallazgos"""
        return len(self.hallazgos)


class CondicionAmbiental(models.Model):
    """
    Modelo para control de condiciones ambientales
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ubicacion = models.CharField(max_length=200, verbose_name=_('Ubicación'))
    area = models.CharField(max_length=100, blank=True, verbose_name=_('Área'))
    
    # Mediciones
    temperatura = models.DecimalField(
        max_digits=4, decimal_places=1,
        verbose_name=_('Temperatura (°C)')
    )
    humedad = models.DecimalField(
        max_digits=4, decimal_places=1,
        verbose_name=_('Humedad (%)')
    )
    presion_atmosferica = models.DecimalField(
        max_digits=6, decimal_places=2,
        null=True, blank=True, verbose_name=_('Presión Atmosférica (hPa)')
    )
    
    # Control
    equipo_medicion = models.CharField(max_length=100, blank=True, verbose_name=_('Equipo de Medición'))
    operador = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True,
        related_name='condiciones_registradas', verbose_name=_('Operador')
    )
    
    # Fechas
    fecha_medicion = models.DateTimeField(auto_now_add=True, verbose_name=_('Fecha de Medición'))
    observaciones = models.TextField(blank=True, verbose_name=_('Observaciones'))
    
    class Meta:
        verbose_name = _('Condición Ambiental')
        verbose_name_plural = _('Condiciones Ambientales')
        ordering = ['-fecha_medicion']
    
    def __str__(self):
        return f"{self.ubicacion} - {self.temperatura}°C - {self.humedad}% - {self.fecha_medicion}"
    
    def cumple_especificaciones(self):
        """Verifica si cumple las especificaciones"""
        # Especificaciones típicas de laboratorio
        temp_ok = 18 <= self.temperatura <= 25
        hum_ok = 30 <= self.humedad <= 70
        return temp_ok and hum_ok
    
    def get_estado(self):
        """Retorna el estado de las condiciones"""
        if self.cumple_especificaciones():
            return 'normal'
        elif self.temperatura < 18 or self.temperatura > 25:
            return 'temperatura_fuera_rango'
        elif self.humedad < 30 or self.humedad > 70:
            return 'humedad_fuera_rango'
        else:
            return 'fuera_rango'
