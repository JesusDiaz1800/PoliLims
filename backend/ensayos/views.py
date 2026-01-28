from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Ensayo, Muestra, ResultadoEnsayo, HistorialEnsayo
from .serializers import (
    EnsayoSerializer, MuestraSerializer, ResultadoEnsayoSerializer,
    HistorialEnsayoSerializer
)


class MuestraListView(generics.ListCreateAPIView):
    queryset = Muestra.objects.all()
    serializer_class = MuestraSerializer
    permission_classes = [permissions.IsAuthenticated]


class MuestraDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Muestra.objects.all()
    serializer_class = MuestraSerializer
    permission_classes = [permissions.IsAuthenticated]


class MuestraCreateView(generics.CreateAPIView):
    queryset = Muestra.objects.all()
    serializer_class = MuestraSerializer
    permission_classes = [permissions.IsAuthenticated]


class MuestraUpdateView(generics.UpdateAPIView):
    queryset = Muestra.objects.all()
    serializer_class = MuestraSerializer
    permission_classes = [permissions.IsAuthenticated]


class MuestraDeleteView(generics.DestroyAPIView):
    queryset = Muestra.objects.all()
    serializer_class = MuestraSerializer
    permission_classes = [permissions.IsAuthenticated]


class EnsayoListView(generics.ListCreateAPIView):
    queryset = Ensayo.objects.all()
    serializer_class = EnsayoSerializer
    permission_classes = [permissions.IsAuthenticated]


class EnsayoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Ensayo.objects.all()
    serializer_class = EnsayoSerializer
    permission_classes = [permissions.IsAuthenticated]


class EnsayoCreateView(generics.CreateAPIView):
    queryset = Ensayo.objects.all()
    serializer_class = EnsayoSerializer
    permission_classes = [permissions.AllowAny]  # Temporal para migración


class EnsayoUpdateView(generics.UpdateAPIView):
    queryset = Ensayo.objects.all()
    serializer_class = EnsayoSerializer
    permission_classes = [permissions.IsAuthenticated]


class EnsayoDeleteView(generics.DestroyAPIView):
    queryset = Ensayo.objects.all()
    serializer_class = EnsayoSerializer
    permission_classes = [permissions.IsAuthenticated]


class EnsayoAprobarView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        try:
            ensayo = Ensayo.objects.get(pk=pk)
            if ensayo.aprobar(request.user):
                return Response({'message': 'Ensayo aprobado exitosamente'})
            return Response({'error': 'No se puede aprobar el ensayo'}, status=status.HTTP_400_BAD_REQUEST)
        except Ensayo.DoesNotExist:
            return Response({'error': 'Ensayo no encontrado'}, status=status.HTTP_404_NOT_FOUND)


class ResultadoEnsayoListView(generics.ListCreateAPIView):
    queryset = ResultadoEnsayo.objects.all()
    serializer_class = ResultadoEnsayoSerializer
    permission_classes = [permissions.IsAuthenticated]


class ResultadoEnsayoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ResultadoEnsayo.objects.all()
    serializer_class = ResultadoEnsayoSerializer
    permission_classes = [permissions.IsAuthenticated]


class ResultadoEnsayoCreateView(generics.CreateAPIView):
    queryset = ResultadoEnsayo.objects.all()
    serializer_class = ResultadoEnsayoSerializer
    permission_classes = [permissions.IsAuthenticated]


class HistorialEnsayoListView(generics.ListAPIView):
    serializer_class = HistorialEnsayoSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        ensayo_id = self.kwargs.get('pk')
        return HistorialEnsayo.objects.filter(ensayo_id=ensayo_id)
