from rest_framework import serializers
from .models import Ensayo, Muestra, ResultadoEnsayo, HistorialEnsayo


class MuestraSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Muestra
    """
    class Meta:
        model = Muestra
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class EnsayoSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Ensayo
    """
    muestra = MuestraSerializer(read_only=True)
    analista_nombre = serializers.CharField(source='analista.full_name', read_only=True)
    supervisor_nombre = serializers.CharField(source='supervisor.full_name', read_only=True)
    aprobado_por_nombre = serializers.CharField(source='aprobado_por.full_name', read_only=True)
    
    class Meta:
        model = Ensayo
        fields = '__all__'
        read_only_fields = ['id', 'codigo', 'created_at', 'updated_at']


class ResultadoEnsayoSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo ResultadoEnsayo
    """
    ensayo_codigo = serializers.CharField(source='ensayo.codigo', read_only=True)
    
    class Meta:
        model = ResultadoEnsayo
        fields = '__all__'
        read_only_fields = ['id', 'fecha_medicion']


class HistorialEnsayoSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo HistorialEnsayo
    """
    usuario_nombre = serializers.CharField(source='usuario.full_name', read_only=True)
    ensayo_codigo = serializers.CharField(source='ensayo.codigo', read_only=True)
    
    class Meta:
        model = HistorialEnsayo
        fields = '__all__'
        read_only_fields = ['id', 'fecha']
