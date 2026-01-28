from rest_framework import serializers
from .models import Proveedor, EvaluacionProveedor, AuditoriaProveedor


class ProveedorSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Proveedor
    """
    responsable_nombre = serializers.CharField(source='responsable.full_name', read_only=True)
    
    class Meta:
        model = Proveedor
        fields = '__all__'
        read_only_fields = ['id', 'codigo', 'created_at', 'updated_at']


class EvaluacionProveedorSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo EvaluacionProveedor
    """
    proveedor_nombre = serializers.CharField(source='proveedor.nombre', read_only=True)
    evaluador_nombre = serializers.CharField(source='evaluador.full_name', read_only=True)
    aprobado_por_nombre = serializers.CharField(source='aprobado_por.full_name', read_only=True)
    
    class Meta:
        model = EvaluacionProveedor
        fields = '__all__'
        read_only_fields = ['id', 'calificacion_promedio', 'created_at', 'updated_at']


class AuditoriaProveedorSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo AuditoriaProveedor
    """
    proveedor_nombre = serializers.CharField(source='proveedor.nombre', read_only=True)
    auditor_lider_nombre = serializers.CharField(source='auditor_lider.full_name', read_only=True)
    
    class Meta:
        model = AuditoriaProveedor
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']
