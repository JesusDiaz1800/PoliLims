from rest_framework import serializers
from .models import Equipo, Calibracion, Mantenimiento, ControlEvento


class EquipoSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Equipo
    """
    responsable_nombre = serializers.CharField(source='responsable.full_name', read_only=True)
    
    class Meta:
        model = Equipo
        fields = '__all__'
        read_only_fields = ['id', 'codigo', 'created_at', 'updated_at']


class CalibracionSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Calibracion
    """
    equipo_codigo = serializers.CharField(source='equipo.codigo', read_only=True)
    calibrado_por_nombre = serializers.CharField(source='calibrado_por.full_name', read_only=True)
    aprobado_por_nombre = serializers.CharField(source='aprobado_por.full_name', read_only=True)
    
    class Meta:
        model = Calibracion
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class MantenimientoSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Mantenimiento
    """
    equipo_codigo = serializers.CharField(source='equipo.codigo', read_only=True)
    asignado_a_nombre = serializers.CharField(source='asignado_a.full_name', read_only=True)
    realizado_por_nombre = serializers.CharField(source='realizado_por.full_name', read_only=True)
    
    class Meta:
        model = Mantenimiento
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class ControlEventoSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo ControlEvento
    """
    equipo_codigo = serializers.CharField(source='equipo.codigo', read_only=True)
    usuario_nombre = serializers.CharField(source='usuario.full_name', read_only=True)
    
    class Meta:
        model = ControlEvento
        fields = '__all__'
        read_only_fields = ['id', 'fecha']
