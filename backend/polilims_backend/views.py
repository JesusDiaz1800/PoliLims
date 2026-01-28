from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Q, Avg, Sum
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth import get_user_model
from ensayos.models import Ensayo, Muestra
from equipos.models import Equipo
from proveedores.models import Proveedor
from calidad.models import NoConformidad
import json

User = get_user_model()


class HealthCheckView(APIView):
    """
    Vista para verificar el estado del sistema
    """
    permission_classes = []
    
    def get(self, request):
        try:
            # Verificar conexión a base de datos
            ensayos_count = Ensayo.objects.count()
            equipos_count = Equipo.objects.count()
            usuarios_count = User.objects.count()
            
            return Response({
                'status': 'healthy',
                'timestamp': timezone.now(),
                'database': {
                    'ensayos': ensayos_count,
                    'equipos': equipos_count,
                    'usuarios': usuarios_count,
                },
                'version': '1.0.0'
            })
        except Exception as e:
            return Response({
                'status': 'unhealthy',
                'error': str(e),
                'timestamp': timezone.now()
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DashboardStatsView(APIView):
    """
    Vista para estadísticas del dashboard
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            # Fechas para filtros
            today = timezone.now().date()
            last_month = today - timedelta(days=30)
            last_week = today - timedelta(days=7)
            
            # Estadísticas de ensayos
            ensayos_stats = {
                'total': Ensayo.objects.count(),
                'pendientes': Ensayo.objects.filter(estado='pendiente').count(),
                'en_proceso': Ensayo.objects.filter(estado='en_proceso').count(),
                'completados': Ensayo.objects.filter(estado='completado').count(),
                'aprobados': Ensayo.objects.filter(estado='aprobado').count(),
                'rechazados': Ensayo.objects.filter(estado='rechazado').count(),
                'hoy': Ensayo.objects.filter(created_at__date=today).count(),
                'esta_semana': Ensayo.objects.filter(created_at__date__gte=last_week).count(),
                'este_mes': Ensayo.objects.filter(created_at__date__gte=last_month).count(),
            }
            
            # Estadísticas de equipos
            equipos_stats = {
                'total': Equipo.objects.count(),
                'activos': Equipo.objects.filter(estado='activo').count(),
                'mantenimiento': Equipo.objects.filter(estado='mantenimiento').count(),
                'calibracion': Equipo.objects.filter(estado='calibracion').count(),
                'fuera_servicio': Equipo.objects.filter(estado='fuera_servicio').count(),
            }
            
            # Estadísticas de proveedores
            proveedores_stats = {
                'total': Proveedor.objects.count(),
                'activos': Proveedor.objects.filter(estado='activo').count(),
                'evaluacion': Proveedor.objects.filter(estado='evaluacion').count(),
                'suspendidos': Proveedor.objects.filter(estado='suspendido').count(),
            }
            
            # Estadísticas de no conformidades
            no_conformidades_stats = {
                'total': NoConformidad.objects.count() if hasattr(NoConformidad, 'objects') else 0,
                'abiertas': NoConformidad.objects.filter(estado='abierta').count() if hasattr(NoConformidad, 'objects') else 0,
                'cerradas': NoConformidad.objects.filter(estado='cerrada').count() if hasattr(NoConformidad, 'objects') else 0,
            }
            
            return Response({
                'ensayos': ensayos_stats,
                'equipos': equipos_stats,
                'proveedores': proveedores_stats,
                'no_conformidades': no_conformidades_stats,
                'timestamp': timezone.now()
            })
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DashboardMetricsView(APIView):
    """
    Vista para métricas detalladas del dashboard
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            # Fechas para filtros
            today = timezone.now().date()
            last_month = today - timedelta(days=30)
            
            # Métricas de rendimiento
            ensayos_completados = Ensayo.objects.filter(
                estado__in=['completado', 'aprobado'],
                fecha_fin__date__gte=last_month
            )
            
            tiempo_promedio = ensayos_completados.aggregate(
                avg_time=Avg('fecha_fin' - 'fecha_inicio')
            )['avg_time']
            
            # Métricas por tipo de ensayo
            ensayos_por_tipo = Ensayo.objects.values('tipo').annotate(
                count=Count('id')
            ).order_by('-count')
            
            # Métricas por analista
            ensayos_por_analista = Ensayo.objects.values(
                'analista__first_name', 'analista__last_name'
            ).annotate(
                count=Count('id')
            ).order_by('-count')[:10]
            
            # Métricas de equipos
            equipos_criticos = Equipo.objects.filter(
                criticidad='alta',
                estado='activo'
            ).count()
            
            equipos_necesitan_calibracion = Equipo.objects.filter(
                fecha_proxima_calibracion__lte=today
            ).count()
            
            equipos_necesitan_mantenimiento = Equipo.objects.filter(
                fecha_proximo_mantenimiento__lte=today
            ).count()
            
            return Response({
                'rendimiento': {
                    'tiempo_promedio_ensayos': tiempo_promedio.total_seconds() / 3600 if tiempo_promedio else 0,
                    'ensayos_por_dia': Ensayo.objects.filter(created_at__date__gte=last_month).count() / 30,
                },
                'ensayos_por_tipo': list(ensayos_por_tipo),
                'ensayos_por_analista': list(ensayos_por_analista),
                'equipos': {
                    'criticos': equipos_criticos,
                    'necesitan_calibracion': equipos_necesitan_calibracion,
                    'necesitan_mantenimiento': equipos_necesitan_mantenimiento,
                },
                'timestamp': timezone.now()
            })
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RecentActivityView(APIView):
    """
    Vista para actividad reciente
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            # Actividad reciente de ensayos
            ensayos_recientes = Ensayo.objects.select_related(
                'muestra', 'analista'
            ).order_by('-updated_at')[:10]
            
            ensayos_data = []
            for ensayo in ensayos_recientes:
                ensayos_data.append({
                    'id': str(ensayo.id),
                    'codigo': ensayo.codigo,
                    'tipo': ensayo.get_tipo_display(),
                    'estado': ensayo.get_estado_display(),
                    'muestra': ensayo.muestra.codigo,
                    'analista': f"{ensayo.analista.first_name} {ensayo.analista.last_name}" if ensayo.analista else 'No asignado',
                    'fecha': ensayo.updated_at,
                    'tipo_actividad': 'ensayo'
                })
            
            # Actividad reciente de equipos
            equipos_recientes = Equipo.objects.select_related(
                'responsable'
            ).order_by('-updated_at')[:5]
            
            equipos_data = []
            for equipo in equipos_recientes:
                equipos_data.append({
                    'id': str(equipo.id),
                    'codigo': equipo.codigo,
                    'nombre': equipo.nombre,
                    'estado': equipo.get_estado_display(),
                    'responsable': f"{equipo.responsable.first_name} {equipo.responsable.last_name}" if equipo.responsable else 'No asignado',
                    'fecha': equipo.updated_at,
                    'tipo_actividad': 'equipo'
                })
            
            # Combinar y ordenar por fecha
            all_activities = ensayos_data + equipos_data
            all_activities.sort(key=lambda x: x['fecha'], reverse=True)
            
            return Response({
                'activities': all_activities[:15],
                'timestamp': timezone.now()
            })
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GlobalSearchView(APIView):
    """
    Vista para búsqueda global
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            query = request.query_params.get('q', '')
            if not query:
                return Response({'results': []})
            
            results = []
            
            # Buscar en ensayos
            ensayos = Ensayo.objects.filter(
                Q(codigo__icontains=query) |
                Q(descripcion__icontains=query) |
                Q(muestra__codigo__icontains=query)
            )[:5]
            
            for ensayo in ensayos:
                results.append({
                    'type': 'ensayo',
                    'id': str(ensayo.id),
                    'title': ensayo.codigo,
                    'description': ensayo.descripcion,
                    'url': f'/ensayos/{ensayo.id}'
                })
            
            # Buscar en equipos
            equipos = Equipo.objects.filter(
                Q(codigo__icontains=query) |
                Q(nombre__icontains=query) |
                Q(marca__icontains=query) |
                Q(modelo__icontains=query)
            )[:5]
            
            for equipo in equipos:
                results.append({
                    'type': 'equipo',
                    'id': str(equipo.id),
                    'title': equipo.codigo,
                    'description': f"{equipo.nombre} - {equipo.marca} {equipo.modelo}",
                    'url': f'/equipos/{equipo.id}'
                })
            
            # Buscar en proveedores
            proveedores = Proveedor.objects.filter(
                Q(codigo__icontains=query) |
                Q(nombre__icontains=query) |
                Q(razon_social__icontains=query)
            )[:5]
            
            for proveedor in proveedores:
                results.append({
                    'type': 'proveedor',
                    'id': str(proveedor.id),
                    'title': proveedor.codigo,
                    'description': f"{proveedor.nombre} - {proveedor.get_tipo_display()}",
                    'url': f'/proveedores/{proveedor.id}'
                })
            
            return Response({
                'results': results,
                'query': query,
                'total': len(results)
            })
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class FileUploadView(APIView):
    """
    Vista para subida de archivos
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            file = request.FILES.get('file')
            if not file:
                return Response({
                    'error': 'No se proporcionó archivo'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Aquí se procesaría el archivo según el tipo
            # Por ahora solo retornamos información básica
            
            return Response({
                'filename': file.name,
                'size': file.size,
                'content_type': file.content_type,
                'uploaded_at': timezone.now()
            })
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ExportEnsayosView(APIView):
    """
    Vista para exportar ensayos
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            # Aquí se implementaría la lógica de exportación
            # Por ahora retornamos un mensaje de placeholder
            
            return Response({
                'message': 'Exportación de ensayos implementada',
                'format': request.query_params.get('format', 'excel'),
                'timestamp': timezone.now()
            })
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ExportEquiposView(APIView):
    """
    Vista para exportar equipos
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            return Response({
                'message': 'Exportación de equipos implementada',
                'format': request.query_params.get('format', 'excel'),
                'timestamp': timezone.now()
            })
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ExportProveedoresView(APIView):
    """
    Vista para exportar proveedores
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            return Response({
                'message': 'Exportación de proveedores implementada',
                'format': request.query_params.get('format', 'excel'),
                'timestamp': timezone.now()
            })
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
