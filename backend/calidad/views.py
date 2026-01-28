from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import NoConformidad, AccionCorrectiva, Auditoria, CondicionAmbiental
from .serializers import (
    NoConformidadSerializer, AccionCorrectivaSerializer, AuditoriaSerializer,
    CondicionAmbientalSerializer
)


class NoConformidadListView(generics.ListCreateAPIView):
    queryset = NoConformidad.objects.all()
    serializer_class = NoConformidadSerializer
    permission_classes = [permissions.IsAuthenticated]


class NoConformidadDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = NoConformidad.objects.all()
    serializer_class = NoConformidadSerializer
    permission_classes = [permissions.IsAuthenticated]


class NoConformidadCreateView(generics.CreateAPIView):
    queryset = NoConformidad.objects.all()
    serializer_class = NoConformidadSerializer
    permission_classes = [permissions.AllowAny]  # Temporal para migración


class NoConformidadUpdateView(generics.UpdateAPIView):
    queryset = NoConformidad.objects.all()
    serializer_class = NoConformidadSerializer
    permission_classes = [permissions.IsAuthenticated]


class NoConformidadDeleteView(generics.DestroyAPIView):
    queryset = NoConformidad.objects.all()
    serializer_class = NoConformidadSerializer
    permission_classes = [permissions.IsAuthenticated]


class NoConformidadCerrarView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        try:
            nc = NoConformidad.objects.get(pk=pk)
            if nc.cerrar(request.user):
                return Response({'message': 'No conformidad cerrada exitosamente'})
            return Response({'error': 'No se puede cerrar la no conformidad'}, status=status.HTTP_400_BAD_REQUEST)
        except NoConformidad.DoesNotExist:
            return Response({'error': 'No conformidad no encontrada'}, status=status.HTTP_404_NOT_FOUND)


class AccionCorrectivaListView(generics.ListCreateAPIView):
    queryset = AccionCorrectiva.objects.all()
    serializer_class = AccionCorrectivaSerializer
    permission_classes = [permissions.IsAuthenticated]


class AccionCorrectivaDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = AccionCorrectiva.objects.all()
    serializer_class = AccionCorrectivaSerializer
    permission_classes = [permissions.IsAuthenticated]


class AccionCorrectivaCreateView(generics.CreateAPIView):
    queryset = AccionCorrectiva.objects.all()
    serializer_class = AccionCorrectivaSerializer
    permission_classes = [permissions.IsAuthenticated]


class AccionCorrectivaUpdateView(generics.UpdateAPIView):
    queryset = AccionCorrectiva.objects.all()
    serializer_class = AccionCorrectivaSerializer
    permission_classes = [permissions.IsAuthenticated]


class AccionCorrectivaCompletarView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        try:
            accion = AccionCorrectiva.objects.get(pk=pk)
            accion.completar()
            return Response({'message': 'Acción correctiva completada exitosamente'})
        except AccionCorrectiva.DoesNotExist:
            return Response({'error': 'Acción correctiva no encontrada'}, status=status.HTTP_404_NOT_FOUND)


class AuditoriaListView(generics.ListCreateAPIView):
    queryset = Auditoria.objects.all()
    serializer_class = AuditoriaSerializer
    permission_classes = [permissions.IsAuthenticated]


class AuditoriaDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Auditoria.objects.all()
    serializer_class = AuditoriaSerializer
    permission_classes = [permissions.IsAuthenticated]


class AuditoriaCreateView(generics.CreateAPIView):
    queryset = Auditoria.objects.all()
    serializer_class = AuditoriaSerializer
    permission_classes = [permissions.IsAuthenticated]


class AuditoriaUpdateView(generics.UpdateAPIView):
    queryset = Auditoria.objects.all()
    serializer_class = AuditoriaSerializer
    permission_classes = [permissions.IsAuthenticated]


class CondicionAmbientalListView(generics.ListCreateAPIView):
    queryset = CondicionAmbiental.objects.all()
    serializer_class = CondicionAmbientalSerializer
    permission_classes = [permissions.IsAuthenticated]


class CondicionAmbientalCreateView(generics.CreateAPIView):
    queryset = CondicionAmbiental.objects.all()
    serializer_class = CondicionAmbientalSerializer
    permission_classes = [permissions.IsAuthenticated]


class CondicionAmbientalDetailView(generics.RetrieveAPIView):
    queryset = CondicionAmbiental.objects.all()
    serializer_class = CondicionAmbientalSerializer
    permission_classes = [permissions.IsAuthenticated]
