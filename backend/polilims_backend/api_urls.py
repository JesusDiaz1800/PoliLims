from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

urlpatterns = [
    # Dashboard endpoints
    path('dashboard/stats/', views.DashboardStatsView.as_view(), name='dashboard-stats'),
    path('dashboard/metrics/', views.DashboardMetricsView.as_view(), name='dashboard-metrics'),
    path('dashboard/recent-activity/', views.RecentActivityView.as_view(), name='recent-activity'),
    
    # Health check
    path('health/', views.HealthCheckView.as_view(), name='health-check'),
    
    # Search endpoints
    path('search/', views.GlobalSearchView.as_view(), name='global-search'),
    
    # File upload endpoints
    path('upload/', views.FileUploadView.as_view(), name='file-upload'),
    
    # Export endpoints
    path('export/ensayos/', views.ExportEnsayosView.as_view(), name='export-ensayos'),
    path('export/equipos/', views.ExportEquiposView.as_view(), name='export-equipos'),
    path('export/proveedores/', views.ExportProveedoresView.as_view(), name='export-proveedores'),
]

urlpatterns += router.urls
