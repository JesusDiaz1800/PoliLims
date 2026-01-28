from django.urls import path
from . import views

urlpatterns = [
    # Reportes generales
    path('', views.ReporteListView.as_view(), name='reporte-list'),
    path('<uuid:pk>/', views.ReporteDetailView.as_view(), name='reporte-detail'),
    path('create/', views.ReporteCreateView.as_view(), name='reporte-create'),
    
    # Reportes específicos
    path('ensayos/', views.ReporteEnsayosView.as_view(), name='reporte-ensayos'),
    path('equipos/', views.ReporteEquiposView.as_view(), name='reporte-equipos'),
    path('proveedores/', views.ReporteProveedoresView.as_view(), name='reporte-proveedores'),
    path('calidad/', views.ReporteCalidadView.as_view(), name='reporte-calidad'),
    
    # Exportación
    path('export/ensayos/', views.ExportEnsayosView.as_view(), name='export-ensayos'),
    path('export/equipos/', views.ExportEquiposView.as_view(), name='export-equipos'),
    path('export/proveedores/', views.ExportProveedoresView.as_view(), name='export-proveedores'),
]
