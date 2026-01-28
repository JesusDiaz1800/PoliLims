from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth import get_user_model
from decimal import Decimal
import uuid
from django.utils import timezone

User = get_user_model()


class Muestra(models.Model):
    """
    Modelo para las muestras de material
    """
    TIPO_MUESTRA_CHOICES = [
        ('tuberia_hdpe', 'Tubería HDPE'),
        ('tuberia_pp', 'Tubería PP'),
        ('materia_prima', 'Materia Prima'),
        ('reprocesado', 'Reprocesado'),
        ('accesorio', 'Accesorio'),
        ('agua', 'Agua'),
    ]
    
    ESTADO_CHOICES = [
        ('recibida', 'Recibida'),
        ('en_proceso', 'En Proceso'),
        ('completada', 'Completada'),
        ('rechazada', 'Rechazada'),
        ('archivada', 'Archivada'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    codigo = models.CharField(max_length=50, unique=True, verbose_name=_('Código'))
    tipo = models.CharField(max_length=20, choices=TIPO_MUESTRA_CHOICES, verbose_name=_('Tipo'))
    descripcion = models.TextField(verbose_name=_('Descripción'))
    cliente = models.CharField(max_length=200, verbose_name=_('Cliente'))
    proveedor = models.CharField(max_length=200, blank=True, verbose_name=_('Proveedor'))
    lote = models.CharField(max_length=50, blank=True, verbose_name=_('Lote'))
    fecha_recepcion = models.DateTimeField(auto_now_add=True, verbose_name=_('Fecha de Recepción'))
    fecha_vencimiento = models.DateField(null=True, blank=True, verbose_name=_('Fecha de Vencimiento'))
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='recibida', verbose_name=_('Estado'))
    cantidad = models.DecimalField(max_digits=10, decimal_places=2, verbose_name=_('Cantidad'))
    unidad = models.CharField(max_length=20, default='kg', verbose_name=_('Unidad'))
    temperatura_almacenamiento = models.DecimalField(
        max_digits=4, decimal_places=1, 
        null=True, blank=True, 
        verbose_name=_('Temperatura de Almacenamiento (°C)')
    )
    humedad_almacenamiento = models.DecimalField(
        max_digits=4, decimal_places=1, 
        null=True, blank=True, 
        verbose_name=_('Humedad de Almacenamiento (%)')
    )
    observaciones = models.TextField(blank=True, verbose_name=_('Observaciones'))
    recibida_por = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, 
        related_name='muestras_recibidas', verbose_name=_('Recibida por')
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Fecha de Creación'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Fecha de Actualización'))
    
    class Meta:
        verbose_name = _('Muestra')
        verbose_name_plural = _('Muestras')
        ordering = ['-fecha_recepcion']
    
    def __str__(self):
        return f"{self.codigo} - {self.tipo} - {self.cliente}"
    
    def get_ensayos_count(self):
        """Retorna el número de ensayos asociados"""
        return self.ensayos.count()
    
    def get_ensayos_completados_count(self):
        """Retorna el número de ensayos completados"""
        return self.ensayos.filter(estado='completado').count()


class Ensayo(models.Model):
    """
    Modelo principal para los ensayos de laboratorio
    """
    TIPO_ENSAYO_CHOICES = [
        ('melt_index', 'Melt Index'),
        ('densidad', 'Densidad'),
        ('resistencia_traccion', 'Resistencia a la Tracción'),
        ('presion_hidrostatica', 'Presión Hidrostática'),
        ('impacto', 'Impacto'),
        ('dureza', 'Dureza'),
        ('color', 'Color'),
        ('dimensiones', 'Dimensiones'),
        ('otros', 'Otros'),
    ]
    
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('en_proceso', 'En Proceso'),
        ('completado', 'Completado'),
        ('aprobado', 'Aprobado'),
        ('rechazado', 'Rechazado'),
        ('cancelado', 'Cancelado'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    codigo = models.CharField(max_length=50, unique=True, verbose_name=_('Código'))
    muestra = models.ForeignKey(
        Muestra, on_delete=models.CASCADE, 
        related_name='ensayos', verbose_name=_('Muestra')
    )
    tipo = models.CharField(max_length=30, choices=TIPO_ENSAYO_CHOICES, verbose_name=_('Tipo'))
    descripcion = models.TextField(verbose_name=_('Descripción'))
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente', verbose_name=_('Estado'))
    
    # Campos de control
    fecha_inicio = models.DateTimeField(null=True, blank=True, verbose_name=_('Fecha de Inicio'))
    fecha_fin = models.DateTimeField(null=True, blank=True, verbose_name=_('Fecha de Finalización'))
    fecha_aprobacion = models.DateTimeField(null=True, blank=True, verbose_name=_('Fecha de Aprobación'))
    
    # Usuarios responsables
    analista = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, 
        related_name='ensayos_asignados', verbose_name=_('Analista')
    )
    supervisor = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='ensayos_supervisados', verbose_name=_('Supervisor')
    )
    aprobado_por = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='ensayos_aprobados', verbose_name=_('Aprobado por')
    )
    
    # Resultados
    resultado = models.JSONField(default=dict, blank=True, verbose_name=_('Resultado'))
    resultado_numerico = models.DecimalField(
        max_digits=10, decimal_places=4, 
        null=True, blank=True, verbose_name=_('Resultado Numérico')
    )
    unidad_resultado = models.CharField(max_length=20, blank=True, verbose_name=_('Unidad del Resultado'))
    
    # Especificaciones
    especificacion_min = models.DecimalField(
        max_digits=10, decimal_places=4, 
        null=True, blank=True, verbose_name=_('Especificación Mínima')
    )
    especificacion_max = models.DecimalField(
        max_digits=10, decimal_places=4, 
        null=True, blank=True, verbose_name=_('Especificación Máxima')
    )
    especificacion_objetivo = models.DecimalField(
        max_digits=10, decimal_places=4, 
        null=True, blank=True, verbose_name=_('Especificación Objetivo')
    )
    
    # Control de calidad
    cumple_especificacion = models.BooleanField(null=True, blank=True, verbose_name=_('Cumple Especificación'))
    observaciones = models.TextField(blank=True, verbose_name=_('Observaciones'))
    observaciones_rechazo = models.TextField(blank=True, verbose_name=_('Observaciones de Rechazo'))
    
    # Metadatos
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Fecha de Creación'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Fecha de Actualización'))
    
    class Meta:
        verbose_name = _('Ensayo')
        verbose_name_plural = _('Ensayos')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.codigo} - {self.get_tipo_display()} - {self.muestra.codigo}"
    
    def save(self, *args, **kwargs):
        # Auto-generar código si no existe
        if not self.codigo:
            self.codigo = f"ENS-{uuid.uuid4().hex[:8].upper()}"
        
        # Auto-calcular si cumple especificación
        if self.resultado_numerico is not None and self.especificacion_min is not None and self.especificacion_max is not None:
            self.cumple_especificacion = (
                self.especificacion_min <= self.resultado_numerico <= self.especificacion_max
            )
        
        super().save(*args, **kwargs)
    
    def get_duracion(self):
        """Retorna la duración del ensayo en horas"""
        if self.fecha_inicio and self.fecha_fin:
            return (self.fecha_fin - self.fecha_inicio).total_seconds() / 3600
        return None
    
    def get_resultado_formateado(self):
        """Retorna el resultado formateado"""
        if self.resultado_numerico is not None:
            return f"{self.resultado_numerico} {self.unidad_resultado}"
        return "N/A"
    
    def puede_ser_aprobado(self):
        """Verifica si el ensayo puede ser aprobado"""
        return (
            self.estado == 'completado' and 
            self.resultado_numerico is not None and
            self.cumple_especificacion is not None
        )
    
    def aprobar(self, aprobado_por):
        """Aprueba el ensayo"""
        if self.puede_ser_aprobado():
            self.estado = 'aprobado'
            self.aprobado_por = aprobado_por
            self.fecha_aprobacion = timezone.now()
            self.save()
            return True
        return False


class ResultadoEnsayo(models.Model):
    """
    Modelo para almacenar resultados detallados de ensayos
    """
    ensayo = models.ForeignKey(
        Ensayo, on_delete=models.CASCADE, 
        related_name='resultados_detallados', verbose_name=_('Ensayo')
    )
    parametro = models.CharField(max_length=100, verbose_name=_('Parámetro'))
    valor = models.DecimalField(max_digits=15, decimal_places=6, verbose_name=_('Valor'))
    unidad = models.CharField(max_length=20, verbose_name=_('Unidad'))
    fecha_medicion = models.DateTimeField(auto_now_add=True, verbose_name=_('Fecha de Medición'))
    equipo_utilizado = models.CharField(max_length=100, blank=True, verbose_name=_('Equipo Utilizado'))
    condiciones_ambientales = models.JSONField(default=dict, blank=True, verbose_name=_('Condiciones Ambientales'))
    observaciones = models.TextField(blank=True, verbose_name=_('Observaciones'))
    
    class Meta:
        verbose_name = _('Resultado de Ensayo')
        verbose_name_plural = _('Resultados de Ensayo')
        ordering = ['-fecha_medicion']
    
    def __str__(self):
        return f"{self.ensayo.codigo} - {self.parametro}: {self.valor} {self.unidad}"


class HistorialEnsayo(models.Model):
    """
    Modelo para el historial de cambios en ensayos
    """
    ensayo = models.ForeignKey(
        Ensayo, on_delete=models.CASCADE, 
        related_name='historial', verbose_name=_('Ensayo')
    )
    usuario = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, 
        verbose_name=_('Usuario')
    )
    accion = models.CharField(max_length=50, verbose_name=_('Acción'))
    descripcion = models.TextField(verbose_name=_('Descripción'))
    datos_anteriores = models.JSONField(default=dict, blank=True, verbose_name=_('Datos Anteriores'))
    datos_nuevos = models.JSONField(default=dict, blank=True, verbose_name=_('Datos Nuevos'))
    fecha = models.DateTimeField(auto_now_add=True, verbose_name=_('Fecha'))
    
    class Meta:
        verbose_name = _('Historial de Ensayo')
        verbose_name_plural = _('Historial de Ensayos')
        ordering = ['-fecha']
    
    def __str__(self):
        return f"{self.ensayo.codigo} - {self.accion} - {self.fecha}"
