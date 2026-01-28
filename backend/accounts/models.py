from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    """
    Modelo de usuario personalizado para PoliLims
    """
    ROLE_CHOICES = [
        ('admin', 'Administrador'),
        ('supervisor', 'Supervisor'),
        ('analista', 'Analista'),
        ('inspector', 'Inspector de Calidad'),
        ('tecnico', 'Técnico'),
        ('cliente', 'Cliente'),
    ]
    
    # Campos adicionales
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='analista',
        verbose_name=_('Rol')
    )
    
    employee_id = models.CharField(
        max_length=20,
        unique=True,
        blank=True,
        null=True,
        verbose_name=_('ID de Empleado')
    )
    
    department = models.CharField(
        max_length=100,
        blank=True,
        verbose_name=_('Departamento')
    )
    
    phone = models.CharField(
        max_length=20,
        blank=True,
        verbose_name=_('Teléfono')
    )
    
    avatar = models.ImageField(
        upload_to='avatars/',
        blank=True,
        null=True,
        verbose_name=_('Avatar')
    )
    
    is_active = models.BooleanField(
        default=True,
        verbose_name=_('Activo')
    )
    
    date_joined = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Fecha de Registro')
    )
    
    last_login = models.DateTimeField(
        auto_now=True,
        verbose_name=_('Último Acceso')
    )
    
    class Meta:
        verbose_name = _('Usuario')
        verbose_name_plural = _('Usuarios')
        ordering = ['username']
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.get_role_display()})"
    
    @property
    def initials(self):
        """Retorna las iniciales del usuario"""
        if self.first_name and self.last_name:
            return f"{self.first_name[0]}{self.last_name[0]}".upper()
        return self.username[:2].upper()
    
    @property
    def full_name(self):
        """Retorna el nombre completo"""
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        return self.username
    
    def has_role(self, role):
        """Verifica si el usuario tiene un rol específico"""
        return self.role == role
    
    def is_supervisor_or_admin(self):
        """Verifica si el usuario es supervisor o administrador"""
        return self.role in ['admin', 'supervisor']
    
    def can_approve_ensayos(self):
        """Verifica si el usuario puede aprobar ensayos"""
        return self.role in ['admin', 'supervisor', 'inspector']
    
    def can_manage_equipment(self):
        """Verifica si el usuario puede gestionar equipos"""
        return self.role in ['admin', 'supervisor', 'tecnico']
    
    def can_view_reports(self):
        """Verifica si el usuario puede ver reportes"""
        return self.role in ['admin', 'supervisor', 'inspector', 'cliente']
    
    def can_manage_users(self):
        """Verifica si el usuario puede gestionar usuarios"""
        return self.role in ['admin']
    
    def get_permissions(self):
        """Retorna los permisos específicos del rol"""
        permissions = {
            'can_approve_ensayos': self.can_approve_ensayos(),
            'can_manage_equipment': self.can_manage_equipment(),
            'can_view_reports': self.can_view_reports(),
            'can_manage_users': self.can_manage_users(),
            'is_supervisor_or_admin': self.is_supervisor_or_admin(),
        }
        return permissions


class UserProfile(models.Model):
    """
    Perfil extendido del usuario
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile',
        verbose_name=_('Usuario')
    )
    
    bio = models.TextField(
        blank=True,
        verbose_name=_('Biografía')
    )
    
    skills = models.JSONField(
        default=list,
        blank=True,
        verbose_name=_('Habilidades')
    )
    
    certifications = models.JSONField(
        default=list,
        blank=True,
        verbose_name=_('Certificaciones')
    )
    
    emergency_contact = models.JSONField(
        default=dict,
        blank=True,
        verbose_name=_('Contacto de Emergencia')
    )
    
    preferences = models.JSONField(
        default=dict,
        blank=True,
        verbose_name=_('Preferencias')
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Fecha de Creación')
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name=_('Fecha de Actualización')
    )
    
    class Meta:
        verbose_name = _('Perfil de Usuario')
        verbose_name_plural = _('Perfiles de Usuario')
    
    def __str__(self):
        return f"Perfil de {self.user.full_name}"
    
    def get_skills_list(self):
        """Retorna la lista de habilidades como string"""
        return ', '.join(self.skills) if self.skills else ''
    
    def get_certifications_list(self):
        """Retorna la lista de certificaciones como string"""
        return ', '.join(self.certifications) if self.certifications else ''
