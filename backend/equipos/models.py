from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth import get_user_model
from decimal import Decimal
import uuid
from django.utils import timezone
from datetime import timedelta

User = get_user_model()


class Equipo(models.Model):
    """
    Modelo para equipos de laboratorio
    """
    TIPO_EQUIPO_CHOICES = [
        ('analitico', 'Analítico'),
        ('medicion', 'Medición'),
        ('control', 'Control'),
        ('auxiliar', 'Auxiliar'),
        ('computacional', 'Computacional'),
    ]
    
    ESTADO_CHOICES = [
        ('activo', 'Activo'),
        ('inactivo', 'Inactivo'),
        ('mantenimiento', 'En Mantenimiento'),
        ('calibracion', 'En Calibración'),
        ('fuera_servicio', 'Fuera de Servicio'),
        ('retirado', 'Retirado'),
    ]
    
    CRITICIDAD_CHOICES = [
        ('alta', 'Alta'),
        ('media', 'Media'),
        ('baja', 'Baja'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    codigo = models.CharField(max_length=50, unique=True, verbose_name=_('Código'))
    nombre = models.CharField(max_length=200, verbose_name=_('Nombre'))
    marca = models.CharField(max_length=100, verbose_name=_('Marca'))
    modelo = models.CharField(max_length=100, verbose_name=_('Modelo'))
    serie = models.CharField(max_length=100, blank=True, verbose_name=_('Número de Serie'))
    
    tipo = models.CharField(max_length=20, choices=TIPO_EQUIPO_CHOICES, verbose_name=_('Tipo'))
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='activo', verbose_name=_('Estado'))
    criticidad = models.CharField(max_length=10, choices=CRITICIDAD_CHOICES, default='media', verbose_name=_('Criticidad'))
    
    # Ubicación
    ubicacion = models.CharField(max_length=200, verbose_name=_('Ubicación'))
    area = models.CharField(max_length=100, blank=True, verbose_name=_('Área'))
    responsable = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='equipos_responsable', verbose_name=_('Responsable')
    )
    
    # Especificaciones técnicas
    especificaciones = models.JSONField(default=dict, blank=True, verbose_name=_('Especificaciones Técnicas'))
    rango_medicion = models.CharField(max_length=200, blank=True, verbose_name=_('Rango de Medición'))
    resolucion = models.CharField(max_length=100, blank=True, verbose_name=_('Resolución'))
    incertidumbre = models.CharField(max_length=100, blank=True, verbose_name=_('Incertidumbre'))
    
    # Fechas importantes
    fecha_adquisicion = models.DateField(null=True, blank=True, verbose_name=_('Fecha de Adquisición'))
    fecha_instalacion = models.DateField(null=True, blank=True, verbose_name=_('Fecha de Instalación'))
    fecha_ultima_calibracion = models.DateField(null=True, blank=True, verbose_name=_('Fecha Última Calibración'))
    fecha_proxima_calibracion = models.DateField(null=True, blank=True, verbose_name=_('Fecha Próxima Calibración'))
    fecha_ultimo_mantenimiento = models.DateField(null=True, blank=True, verbose_name=_('Fecha Último Mantenimiento'))
    fecha_proximo_mantenimiento = models.DateField(null=True, blank=True, verbose_name=_('Fecha Próximo Mantenimiento'))
    
    # Proveedor y servicio
    proveedor = models.CharField(max_length=200, blank=True, verbose_name=_('Proveedor'))
    contacto_proveedor = models.CharField(max_length=200, blank=True, verbose_name=_('Contacto Proveedor'))
    costo_adquisicion = models.DecimalField(
        max_digits=12, decimal_places=2, 
        null=True, blank=True, verbose_name=_('Costo de Adquisición')
    )
    
    # Documentación
    manual_usuario = models.FileField(
        upload_to='equipos/manuales/', 
        blank=True, null=True, verbose_name=_('Manual de Usuario')
    )
    certificado_calibracion = models.FileField(
        upload_to='equipos/certificados/', 
        blank=True, null=True, verbose_name=_('Certificado de Calibración')
    )
    
    # Observaciones y estado
    observaciones = models.TextField(blank=True, verbose_name=_('Observaciones'))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Fecha de Creación'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Fecha de Actualización'))
    
    class Meta:
        verbose_name = _('Equipo')
        verbose_name_plural = _('Equipos')
        ordering = ['codigo']
    
    def __str__(self):
        return f"{self.codigo} - {self.nombre}"
    
    def save(self, *args, **kwargs):
        # Auto-generar código si no existe
        if not self.codigo:
            self.codigo = f"EQ-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)
    
    def get_edad(self):
        """Retorna la edad del equipo en años"""
        if self.fecha_adquisicion:
            return (timezone.now().date() - self.fecha_adquisicion).days / 365.25
        return None
    
    def necesita_calibracion(self):
        """Verifica si el equipo necesita calibración"""
        if self.fecha_proxima_calibracion:
            return timezone.now().date() >= self.fecha_proxima_calibracion
        return False
    
    def necesita_mantenimiento(self):
        """Verifica si el equipo necesita mantenimiento"""
        if self.fecha_proximo_mantenimiento:
            return timezone.now().date() >= self.fecha_proximo_mantenimiento
        return False
    
    def get_estado_operacional(self):
        """Retorna el estado operacional del equipo"""
        if self.estado == 'activo' and not self.necesita_calibracion() and not self.necesita_mantenimiento():
            return 'operativo'
        elif self.necesita_calibracion():
            return 'necesita_calibracion'
        elif self.necesita_mantenimiento():
            return 'necesita_mantenimiento'
        else:
            return self.estado


class Calibracion(models.Model):
    """
    Modelo para calibraciones de equipos
    """
    TIPO_CALIBRACION_CHOICES = [
        ('interna', 'Interna'),
        ('externa', 'Externa'),
        ('verificacion', 'Verificación'),
    ]
    
    RESULTADO_CHOICES = [
        ('aprobado', 'Aprobado'),
        ('rechazado', 'Rechazado'),
        ('condicional', 'Condicional'),
    ]
    
    equipo = models.ForeignKey(
        Equipo, on_delete=models.CASCADE, 
        related_name='calibraciones', verbose_name=_('Equipo')
    )
    tipo = models.CharField(max_length=20, choices=TIPO_CALIBRACION_CHOICES, verbose_name=_('Tipo'))
    fecha_calibracion = models.DateField(verbose_name=_('Fecha de Calibración'))
    fecha_vencimiento = models.DateField(verbose_name=_('Fecha de Vencimiento'))
    
    # Responsables
    calibrado_por = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True,
        related_name='calibraciones_realizadas', verbose_name=_('Calibrado por')
    )
    aprobado_por = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='calibraciones_aprobadas', verbose_name=_('Aprobado por')
    )
    
    # Resultados
    resultado = models.CharField(max_length=20, choices=RESULTADO_CHOICES, verbose_name=_('Resultado'))
    certificado = models.FileField(
        upload_to='equipos/calibraciones/', 
        blank=True, null=True, verbose_name=_('Certificado')
    )
    
    # Datos técnicos
    patron_utilizado = models.CharField(max_length=200, blank=True, verbose_name=_('Patrón Utilizado'))
    incertidumbre_medicion = models.CharField(max_length=100, blank=True, verbose_name=_('Incertidumbre de Medición'))
    condiciones_ambientales = models.JSONField(default=dict, blank=True, verbose_name=_('Condiciones Ambientales'))
    
    # Observaciones
    observaciones = models.TextField(blank=True, verbose_name=_('Observaciones'))
    recomendaciones = models.TextField(blank=True, verbose_name=_('Recomendaciones'))
    
    # Metadatos
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Fecha de Creación'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Fecha de Actualización'))
    
    class Meta:
        verbose_name = _('Calibración')
        verbose_name_plural = _('Calibraciones')
        ordering = ['-fecha_calibracion']
    
    def __str__(self):
        return f"{self.equipo.codigo} - {self.fecha_calibracion} - {self.get_resultado_display()}"
    
    def save(self, *args, **kwargs):
        # Actualizar fechas del equipo
        if self.resultado == 'aprobado':
            self.equipo.fecha_ultima_calibracion = self.fecha_calibracion
            self.equipo.fecha_proxima_calibracion = self.fecha_vencimiento
            self.equipo.save()
        super().save(*args, **kwargs)
    
    def esta_vencida(self):
        """Verifica si la calibración está vencida"""
        return timezone.now().date() >= self.fecha_vencimiento
    
    def dias_para_vencer(self):
        """Retorna los días para que venza la calibración"""
        if self.fecha_vencimiento:
            return (self.fecha_vencimiento - timezone.now().date()).days
        return None


class Mantenimiento(models.Model):
    """
    Modelo para mantenimientos de equipos
    """
    TIPO_MANTENIMIENTO_CHOICES = [
        ('preventivo', 'Preventivo'),
        ('correctivo', 'Correctivo'),
        ('predictivo', 'Predictivo'),
    ]
    
    PRIORIDAD_CHOICES = [
        ('alta', 'Alta'),
        ('media', 'Media'),
        ('baja', 'Baja'),
    ]
    
    ESTADO_CHOICES = [
        ('programado', 'Programado'),
        ('en_proceso', 'En Proceso'),
        ('completado', 'Completado'),
        ('cancelado', 'Cancelado'),
    ]
    
    equipo = models.ForeignKey(
        Equipo, on_delete=models.CASCADE, 
        related_name='mantenimientos', verbose_name=_('Equipo')
    )
    tipo = models.CharField(max_length=20, choices=TIPO_MANTENIMIENTO_CHOICES, verbose_name=_('Tipo'))
    prioridad = models.CharField(max_length=10, choices=PRIORIDAD_CHOICES, default='media', verbose_name=_('Prioridad'))
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='programado', verbose_name=_('Estado'))
    
    # Fechas
    fecha_programada = models.DateField(verbose_name=_('Fecha Programada'))
    fecha_inicio = models.DateTimeField(null=True, blank=True, verbose_name=_('Fecha de Inicio'))
    fecha_fin = models.DateTimeField(null=True, blank=True, verbose_name=_('Fecha de Finalización'))
    
    # Responsables
    asignado_a = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True,
        related_name='mantenimientos_asignados', verbose_name=_('Asignado a')
    )
    realizado_por = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='mantenimientos_realizados', verbose_name=_('Realizado por')
    )
    
    # Descripción y resultados
    descripcion = models.TextField(verbose_name=_('Descripción'))
    actividades_realizadas = models.TextField(blank=True, verbose_name=_('Actividades Realizadas'))
    repuestos_utilizados = models.JSONField(default=list, blank=True, verbose_name=_('Repuestos Utilizados'))
    costo = models.DecimalField(
        max_digits=10, decimal_places=2, 
        null=True, blank=True, verbose_name=_('Costo')
    )
    
    # Observaciones
    observaciones = models.TextField(blank=True, verbose_name=_('Observaciones'))
    recomendaciones = models.TextField(blank=True, verbose_name=_('Recomendaciones'))
    
    # Metadatos
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Fecha de Creación'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Fecha de Actualización'))
    
    class Meta:
        verbose_name = _('Mantenimiento')
        verbose_name_plural = _('Mantenimientos')
        ordering = ['-fecha_programada']
    
    def __str__(self):
        return f"{self.equipo.codigo} - {self.get_tipo_display()} - {self.fecha_programada}"
    
    def save(self, *args, **kwargs):
        # Actualizar fechas del equipo cuando se completa
        if self.estado == 'completado' and self.fecha_fin:
            self.equipo.fecha_ultimo_mantenimiento = self.fecha_fin.date()
            # Calcular próxima fecha de mantenimiento (ejemplo: 6 meses)
            self.equipo.fecha_proximo_mantenimiento = self.fecha_fin.date() + timedelta(days=180)
            self.equipo.save()
        super().save(*args, **kwargs)
    
    def get_duracion(self):
        """Retorna la duración del mantenimiento en horas"""
        if self.fecha_inicio and self.fecha_fin:
            return (self.fecha_fin - self.fecha_inicio).total_seconds() / 3600
        return None
    
    def esta_atrasado(self):
        """Verifica si el mantenimiento está atrasado"""
        return self.estado == 'programado' and timezone.now().date() > self.fecha_programada


class ControlEvento(models.Model):
    """
    Modelo para eventos de control de equipos
    """
    TIPO_EVENTO_CHOICES = [
        ('inicio_uso', 'Inicio de Uso'),
        ('fin_uso', 'Fin de Uso'),
        ('verificacion', 'Verificación'),
        ('ajuste', 'Ajuste'),
        ('limpieza', 'Limpieza'),
        ('incidente', 'Incidente'),
    ]
    
    equipo = models.ForeignKey(
        Equipo, on_delete=models.CASCADE, 
        related_name='eventos_control', verbose_name=_('Equipo')
    )
    tipo = models.CharField(max_length=20, choices=TIPO_EVENTO_CHOICES, verbose_name=_('Tipo'))
    fecha = models.DateTimeField(auto_now_add=True, verbose_name=_('Fecha'))
    
    # Usuario responsable
    usuario = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True,
        related_name='eventos_control', verbose_name=_('Usuario')
    )
    
    # Datos del evento
    descripcion = models.TextField(verbose_name=_('Descripción'))
    datos_medicion = models.JSONField(default=dict, blank=True, verbose_name=_('Datos de Medición'))
    condiciones_ambientales = models.JSONField(default=dict, blank=True, verbose_name=_('Condiciones Ambientales'))
    
    # Observaciones
    observaciones = models.TextField(blank=True, verbose_name=_('Observaciones'))
    
    class Meta:
        verbose_name = _('Evento de Control')
        verbose_name_plural = _('Eventos de Control')
        ordering = ['-fecha']
    
    def __str__(self):
        return f"{self.equipo.codigo} - {self.get_tipo_display()} - {self.fecha}"
