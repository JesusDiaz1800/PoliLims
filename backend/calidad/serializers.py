from rest_framework import serializers
from .models import NoConformidad, AccionCorrectiva, Auditoria, CondicionAmbiental


class NoConformidadSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo NoConformidad
    """
    reportado_por_nombre = serializers.CharField(source='reportado_por.full_name', read_only=True)
    responsable_nombre = serializers.CharField(source='responsable.full_name', read_only=True)
    cerrado_por_nombre = serializers.CharField(source='cerrado_por.full_name', read_only=True)
    
    class Meta:
        model = NoConformidad
        fields = '__all__'
        read_only_fields = ['id', 'codigo', 'created_at', 'updated_at']


class AccionCorrectivaSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo AccionCorrectiva
    """
    no_conformidad_codigo = serializers.CharField(source='no_conformidad.codigo', read_only=True)
    responsable_nombre = serializers.CharField(source='responsable.full_name', read_only=True)
    
    class Meta:
        model = AccionCorrectiva
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class AuditoriaSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Auditoria
    """
    auditor_lider_nombre = serializers.CharField(source='auditor_lider.full_name', read_only=True)
    
    class Meta:
        model = Auditoria
        fields = '__all__'
        read_only_fields = ['id', 'codigo', 'created_at', 'updated_at']


class CondicionAmbientalSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo CondicionAmbiental
    """
    operador_nombre = serializers.CharField(source='operador.full_name', read_only=True)
    
    class Meta:
        model = CondicionAmbiental
        fields = '__all__'
        read_only_fields = ['id', 'fecha_medicion']
