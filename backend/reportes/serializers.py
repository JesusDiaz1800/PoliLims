from rest_framework import serializers


class ReporteSerializer(serializers.Serializer):
    """
    Serializer básico para reportes
    """
    id = serializers.UUIDField(read_only=True)
    titulo = serializers.CharField()
    descripcion = serializers.CharField()
    tipo = serializers.CharField()
    fecha_generacion = serializers.DateTimeField(read_only=True)
    estado = serializers.CharField()
