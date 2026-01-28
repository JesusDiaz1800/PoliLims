from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth import get_user_model
from decimal import Decimal
import uuid
from django.utils import timezone

User = get_user_model()


class Proveedor(models.Model):
    """
    Modelo para proveedores de materiales y servicios
    """
    TIPO_PROVEEDOR_CHOICES = [
        ('materiales', 'Materiales'),
        ('equipos', 'Equipos'),
        ('servicios', 'Servicios'),
        ('calibracion', 'Calibración'),
        ('mantenimiento', 'Mantenimiento'),
        ('otros', 'Otros'),
    ]
    
    ESTADO_CHOICES = [
        ('activo', 'Activo'),
        ('inactivo', 'Inactivo'),
        ('suspendido', 'Suspendido'),
        ('evaluacion', 'En Evaluación'),
    ]
    
    CATEGORIA_CHOICES = [
        ('a', 'Categoría A - Crítico'),
        ('b', 'Categoría B - Importante'),
        ('c', 'Categoría C - Estándar'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    codigo = models.CharField(max_length=20, unique=True, verbose_name=_('Código'))
    nombre = models.CharField(max_length=200, verbose_name=_('Nombre'))
    razon_social = models.CharField(max_length=200, verbose_name=_('Razón Social'))
    nit = models.CharField(max_length=20, unique=True, verbose_name=_('NIT'))
    
    tipo = models.CharField(max_length=20, choices=TIPO_PROVEEDOR_CHOICES, verbose_name=_('Tipo'))
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='activo', verbose_name=_('Estado'))
    categoria = models.CharField(max_length=1, choices=CATEGORIA_CHOICES, default='c', verbose_name=_('Categoría'))
    
    # Información de contacto
    direccion = models.TextField(verbose_name=_('Dirección'))
    ciudad = models.CharField(max_length=100, verbose_name=_('Ciudad'))
    departamento = models.CharField(max_length=100, verbose_name=_('Departamento'))
    pais = models.CharField(max_length=100, default='Colombia', verbose_name=_('País'))
    telefono = models.CharField(max_length=20, verbose_name=_('Teléfono'))
    email = models.EmailField(verbose_name=_('Email'))
    sitio_web = models.URLField(blank=True, verbose_name=_('Sitio Web'))
    
    # Contacto principal
    contacto_principal = models.CharField(max_length=200, verbose_name=_('Contacto Principal'))
    cargo_contacto = models.CharField(max_length=100, verbose_name=_('Cargo del Contacto'))
    telefono_contacto = models.CharField(max_length=20, verbose_name=_('Teléfono del Contacto'))
    email_contacto = models.EmailField(verbose_name=_('Email del Contacto'))
    
    # Información comercial
    productos_servicios = models.TextField(verbose_name=_('Productos/Servicios'))
    capacidad_produccion = models.CharField(max_length=200, blank=True, verbose_name=_('Capacidad de Producción'))
    certificaciones = models.JSONField(default=list, blank=True, verbose_name=_('Certificaciones'))
    experiencia_anos = models.PositiveIntegerField(default=0, verbose_name=_('Años de Experiencia'))
    
    # Evaluación
    calificacion_general = models.DecimalField(
        max_digits=3, decimal_places=1,
        null=True, blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        verbose_name=_('Calificación General')
    )
    fecha_ultima_evaluacion = models.DateField(null=True, blank=True, verbose_name=_('Fecha Última Evaluación'))
    fecha_proxima_evaluacion = models.DateField(null=True, blank=True, verbose_name=_('Fecha Próxima Evaluación'))
    
    # Información financiera
    limite_credito = models.DecimalField(
        max_digits=15, decimal_places=2,
        null=True, blank=True, verbose_name=_('Límite de Crédito')
    )
    condiciones_pago = models.CharField(max_length=200, blank=True, verbose_name=_('Condiciones de Pago'))
    
    # Documentación
    certificado_camara_comercio = models.FileField(
        upload_to='proveedores/certificados/',
        blank=True, null=True, verbose_name=_('Certificado Cámara de Comercio')
    )
    certificado_rut = models.FileField(
        upload_to='proveedores/certificados/',
        blank=True, null=True, verbose_name=_('Certificado RUT')
    )
    otros_documentos = models.JSONField(default=list, blank=True, verbose_name=_('Otros Documentos'))
    
    # Observaciones y estado
    observaciones = models.TextField(blank=True, verbose_name=_('Observaciones'))
    responsable = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='proveedores_responsable', verbose_name=_('Responsable')
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Fecha de Creación'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Fecha de Actualización'))
    
    class Meta:
        verbose_name = _('Proveedor')
        verbose_name_plural = _('Proveedores')
        ordering = ['nombre']
    
    def __str__(self):
        return f"{self.codigo} - {self.nombre}"
    
    def save(self, *args, **kwargs):
        # Auto-generar código si no existe
        if not self.codigo:
            self.codigo = f"PROV-{uuid.uuid4().hex[:6].upper()}"
        super().save(*args, **kwargs)
    
    def necesita_evaluacion(self):
        """Verifica si el proveedor necesita evaluación"""
        if self.fecha_proxima_evaluacion:
            return timezone.now().date() >= self.fecha_proxima_evaluacion
        return False
    
    def get_estado_evaluacion(self):
        """Retorna el estado de evaluación del proveedor"""
        if not self.fecha_ultima_evaluacion:
            return 'sin_evaluar'
        elif self.necesita_evaluacion():
            return 'evaluacion_vencida'
        else:
            return 'evaluacion_vigente'
    
    def get_certificaciones_list(self):
        """Retorna la lista de certificaciones como string"""
        return ', '.join(self.certificaciones) if self.certificaciones else ''


class EvaluacionProveedor(models.Model):
    """
    Modelo para evaluaciones de proveedores
    """
    CRITERIO_CHOICES = [
        ('calidad', 'Calidad'),
        ('entrega', 'Entrega'),
        ('precio', 'Precio'),
        ('servicio', 'Servicio'),
        ('tecnico', 'Aspecto Técnico'),
        ('financiero', 'Aspecto Financiero'),
    ]
    
    proveedor = models.ForeignKey(
        Proveedor, on_delete=models.CASCADE,
        related_name='evaluaciones', verbose_name=_('Proveedor')
    )
    fecha_evaluacion = models.DateField(verbose_name=_('Fecha de Evaluación'))
    evaluador = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True,
        related_name='evaluaciones_realizadas', verbose_name=_('Evaluador')
    )
    
    # Criterios de evaluación
    calificacion_calidad = models.DecimalField(
        max_digits=3, decimal_places=1,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        verbose_name=_('Calificación Calidad')
    )
    calificacion_entrega = models.DecimalField(
        max_digits=3, decimal_places=1,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        verbose_name=_('Calificación Entrega')
    )
    calificacion_precio = models.DecimalField(
        max_digits=3, decimal_places=1,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        verbose_name=_('Calificación Precio')
    )
    calificacion_servicio = models.DecimalField(
        max_digits=3, decimal_places=1,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        verbose_name=_('Calificación Servicio')
    )
    calificacion_tecnico = models.DecimalField(
        max_digits=3, decimal_places=1,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        verbose_name=_('Calificación Aspecto Técnico')
    )
    calificacion_financiero = models.DecimalField(
        max_digits=3, decimal_places=1,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        verbose_name=_('Calificación Aspecto Financiero')
    )
    
    # Resultados
    calificacion_promedio = models.DecimalField(
        max_digits=3, decimal_places=1,
        verbose_name=_('Calificación Promedio')
    )
    conclusion = models.TextField(verbose_name=_('Conclusión'))
    recomendaciones = models.TextField(blank=True, verbose_name=_('Recomendaciones'))
    
    # Acciones
    acciones_mejora = models.JSONField(default=list, blank=True, verbose_name=_('Acciones de Mejora'))
    fecha_seguimiento = models.DateField(null=True, blank=True, verbose_name=_('Fecha de Seguimiento'))
    
    # Documentación
    reporte_evaluacion = models.FileField(
        upload_to='proveedores/evaluaciones/',
        blank=True, null=True, verbose_name=_('Reporte de Evaluación')
    )
    
    # Metadatos
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Fecha de Creación'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Fecha de Actualización'))
    
    class Meta:
        verbose_name = _('Evaluación de Proveedor')
        verbose_name_plural = _('Evaluaciones de Proveedores')
        ordering = ['-fecha_evaluacion']
    
    def __str__(self):
        return f"{self.proveedor.nombre} - {self.fecha_evaluacion}"
    
    def save(self, *args, **kwargs):
        # Calcular calificación promedio
        calificaciones = [
            self.calificacion_calidad,
            self.calificacion_entrega,
            self.calificacion_precio,
            self.calificacion_servicio,
            self.calificacion_tecnico,
            self.calificacion_financiero,
        ]
        self.calificacion_promedio = sum(calificaciones) / len(calificaciones)
        
        # Actualizar calificación del proveedor
        self.proveedor.calificacion_general = self.calificacion_promedio
        self.proveedor.fecha_ultima_evaluacion = self.fecha_evaluacion
        self.proveedor.save()
        
        super().save(*args, **kwargs)
    
    def get_estado_acciones(self):
        """Retorna el estado de las acciones de mejora"""
        if not self.acciones_mejora:
            return 'sin_acciones'
        elif self.fecha_seguimiento and timezone.now().date() > self.fecha_seguimiento:
            return 'vencidas'
        else:
            return 'vigentes'


class AuditoriaProveedor(models.Model):
    """
    Modelo para auditorías de proveedores
    """
    TIPO_AUDITORIA_CHOICES = [
        ('documental', 'Documental'),
        ('in_situ', 'In Situ'),
        ('seguimiento', 'Seguimiento'),
        ('certificacion', 'Certificación'),
    ]
    
    RESULTADO_CHOICES = [
        ('conforme', 'Conforme'),
        ('no_conforme', 'No Conforme'),
        ('conforme_con_observaciones', 'Conforme con Observaciones'),
    ]
    
    proveedor = models.ForeignKey(
        Proveedor, on_delete=models.CASCADE,
        related_name='auditorias', verbose_name=_('Proveedor')
    )
    tipo = models.CharField(max_length=20, choices=TIPO_AUDITORIA_CHOICES, verbose_name=_('Tipo'))
    fecha_auditoria = models.DateField(verbose_name=_('Fecha de Auditoría'))
    fecha_proxima_auditoria = models.DateField(null=True, blank=True, verbose_name=_('Fecha Próxima Auditoría'))
    
    # Equipo auditor
    auditor_lider = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True,
        related_name='auditorias_proveedores_lideradas', verbose_name=_('Auditor Líder')
    )
    equipo_auditor = models.JSONField(default=list, blank=True, verbose_name=_('Equipo Auditor'))
    
    # Alcance y objetivos
    alcance = models.TextField(verbose_name=_('Alcance'))
    objetivos = models.TextField(verbose_name=_('Objetivos'))
    
    # Resultados
    resultado = models.CharField(max_length=30, choices=RESULTADO_CHOICES, verbose_name=_('Resultado'))
    hallazgos = models.JSONField(default=list, blank=True, verbose_name=_('Hallazgos'))
    no_conformidades = models.JSONField(default=list, blank=True, verbose_name=_('No Conformidades'))
    observaciones = models.JSONField(default=list, blank=True, verbose_name=_('Observaciones'))
    
    # Acciones correctivas
    acciones_correctivas = models.JSONField(default=list, blank=True, verbose_name=_('Acciones Correctivas'))
    fecha_limite_acciones = models.DateField(null=True, blank=True, verbose_name=_('Fecha Límite Acciones'))
    
    # Documentación
    plan_auditoria = models.FileField(
        upload_to='proveedores/auditorias/',
        blank=True, null=True, verbose_name=_('Plan de Auditoría')
    )
    reporte_auditoria = models.FileField(
        upload_to='proveedores/auditorias/',
        blank=True, null=True, verbose_name=_('Reporte de Auditoría')
    )
    evidencias = models.JSONField(default=list, blank=True, verbose_name=_('Evidencias'))
    
    # Metadatos
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Fecha de Creación'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Fecha de Actualización'))
    
    class Meta:
        verbose_name = _('Auditoría de Proveedor')
        verbose_name_plural = _('Auditorías de Proveedores')
        ordering = ['-fecha_auditoria']
    
    def __str__(self):
        return f"{self.proveedor.nombre} - {self.get_tipo_display()} - {self.fecha_auditoria}"
    
    def get_no_conformidades_count(self):
        """Retorna el número de no conformidades"""
        return len(self.no_conformidades)
    
    def get_acciones_pendientes(self):
        """Retorna las acciones correctivas pendientes"""
        return [accion for accion in self.acciones_correctivas if not accion.get('completada', False)]
    
    def get_acciones_vencidas(self):
        """Retorna las acciones correctivas vencidas"""
        if not self.fecha_limite_acciones:
            return []
        return [
            accion for accion in self.acciones_correctivas 
            if not accion.get('completada', False) and 
            timezone.now().date() > self.fecha_limite_acciones
        ]
