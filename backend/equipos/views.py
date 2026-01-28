from rest_framework import generics, permissions
from .models import Equipo, Calibracion, Mantenimiento, ControlEvento
from .serializers import (
    EquipoSerializer, CalibracionSerializer, MantenimientoSerializer,
    ControlEventoSerializer
)


class EquipoListView(generics.ListCreateAPIView):
    queryset = Equipo.objects.all()
    serializer_class = EquipoSerializer
    permission_classes = [permissions.IsAuthenticated]


class EquipoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Equipo.objects.all()
    serializer_class = EquipoSerializer
    permission_classes = [permissions.IsAuthenticated]


class EquipoCreateView(generics.CreateAPIView):
    queryset = Equipo.objects.all()
    serializer_class = EquipoSerializer
    permission_classes = [permissions.AllowAny]  # Temporal para migración


class EquipoUpdateView(generics.UpdateAPIView):
    queryset = Equipo.objects.all()
    serializer_class = EquipoSerializer
    permission_classes = [permissions.IsAuthenticated]


class EquipoDeleteView(generics.DestroyAPIView):
    queryset = Equipo.objects.all()
    serializer_class = EquipoSerializer
    permission_classes = [permissions.IsAuthenticated]


class CalibracionListView(generics.ListCreateAPIView):
    queryset = Calibracion.objects.all()
    serializer_class = CalibracionSerializer
    permission_classes = [permissions.IsAuthenticated]


class CalibracionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Calibracion.objects.all()
    serializer_class = CalibracionSerializer
    permission_classes = [permissions.IsAuthenticated]


class CalibracionCreateView(generics.CreateAPIView):
    queryset = Calibracion.objects.all()
    serializer_class = CalibracionSerializer
    permission_classes = [permissions.IsAuthenticated]


class CalibracionUpdateView(generics.UpdateAPIView):
    queryset = Calibracion.objects.all()
    serializer_class = CalibracionSerializer
    permission_classes = [permissions.IsAuthenticated]


class MantenimientoListView(generics.ListCreateAPIView):
    queryset = Mantenimiento.objects.all()
    serializer_class = MantenimientoSerializer
    permission_classes = [permissions.IsAuthenticated]


class MantenimientoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Mantenimiento.objects.all()
    serializer_class = MantenimientoSerializer
    permission_classes = [permissions.IsAuthenticated]


class MantenimientoCreateView(generics.CreateAPIView):
    queryset = Mantenimiento.objects.all()
    serializer_class = MantenimientoSerializer
    permission_classes = [permissions.IsAuthenticated]


class MantenimientoUpdateView(generics.UpdateAPIView):
    queryset = Mantenimiento.objects.all()
    serializer_class = MantenimientoSerializer
    permission_classes = [permissions.IsAuthenticated]


class ControlEventoListView(generics.ListCreateAPIView):
    queryset = ControlEvento.objects.all()
    serializer_class = ControlEventoSerializer
    permission_classes = [permissions.IsAuthenticated]


class ControlEventoCreateView(generics.CreateAPIView):
    queryset = ControlEvento.objects.all()
    serializer_class = ControlEventoSerializer
    permission_classes = [permissions.IsAuthenticated]
