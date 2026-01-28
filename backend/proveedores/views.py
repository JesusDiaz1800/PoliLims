from django.shortcuts import render
from rest_framework import generics, permissions
from .models import Proveedor, EvaluacionProveedor, AuditoriaProveedor
from .serializers import (
    ProveedorSerializer, EvaluacionProveedorSerializer, AuditoriaProveedorSerializer
)


class ProveedorListView(generics.ListCreateAPIView):
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer
    permission_classes = [permissions.IsAuthenticated]


class ProveedorDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer
    permission_classes = [permissions.IsAuthenticated]


class ProveedorCreateView(generics.CreateAPIView):
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer
    permission_classes = [permissions.AllowAny]  # Temporal para migración


class ProveedorUpdateView(generics.UpdateAPIView):
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer
    permission_classes = [permissions.IsAuthenticated]


class ProveedorDeleteView(generics.DestroyAPIView):
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer
    permission_classes = [permissions.IsAuthenticated]


class EvaluacionProveedorListView(generics.ListCreateAPIView):
    queryset = EvaluacionProveedor.objects.all()
    serializer_class = EvaluacionProveedorSerializer
    permission_classes = [permissions.IsAuthenticated]


class EvaluacionProveedorDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = EvaluacionProveedor.objects.all()
    serializer_class = EvaluacionProveedorSerializer
    permission_classes = [permissions.IsAuthenticated]


class EvaluacionProveedorCreateView(generics.CreateAPIView):
    queryset = EvaluacionProveedor.objects.all()
    serializer_class = EvaluacionProveedorSerializer
    permission_classes = [permissions.IsAuthenticated]


class EvaluacionProveedorUpdateView(generics.UpdateAPIView):
    queryset = EvaluacionProveedor.objects.all()
    serializer_class = EvaluacionProveedorSerializer
    permission_classes = [permissions.IsAuthenticated]


class AuditoriaProveedorListView(generics.ListCreateAPIView):
    queryset = AuditoriaProveedor.objects.all()
    serializer_class = AuditoriaProveedorSerializer
    permission_classes = [permissions.IsAuthenticated]


class AuditoriaProveedorDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = AuditoriaProveedor.objects.all()
    serializer_class = AuditoriaProveedorSerializer
    permission_classes = [permissions.IsAuthenticated]


class AuditoriaProveedorCreateView(generics.CreateAPIView):
    queryset = AuditoriaProveedor.objects.all()
    serializer_class = AuditoriaProveedorSerializer
    permission_classes = [permissions.IsAuthenticated]


class AuditoriaProveedorUpdateView(generics.UpdateAPIView):
    queryset = AuditoriaProveedor.objects.all()
    serializer_class = AuditoriaProveedorSerializer
    permission_classes = [permissions.IsAuthenticated]
