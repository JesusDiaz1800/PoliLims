from django.urls import path
from . import views

urlpatterns = [
    # Proveedores
    path('', views.ProveedorListView.as_view(), name='proveedor-list'),
    path('<uuid:pk>/', views.ProveedorDetailView.as_view(), name='proveedor-detail'),
    path('create/', views.ProveedorCreateView.as_view(), name='proveedor-create'),
    path('<uuid:pk>/update/', views.ProveedorUpdateView.as_view(), name='proveedor-update'),
    path('<uuid:pk>/delete/', views.ProveedorDeleteView.as_view(), name='proveedor-delete'),
    
    # Evaluaciones
    path('evaluaciones/', views.EvaluacionProveedorListView.as_view(), name='evaluacion-list'),
    path('evaluaciones/<uuid:pk>/', views.EvaluacionProveedorDetailView.as_view(), name='evaluacion-detail'),
    path('evaluaciones/create/', views.EvaluacionProveedorCreateView.as_view(), name='evaluacion-create'),
    path('evaluaciones/<uuid:pk>/update/', views.EvaluacionProveedorUpdateView.as_view(), name='evaluacion-update'),
    
    # Auditorías
    path('auditorias/', views.AuditoriaProveedorListView.as_view(), name='auditoria-list'),
    path('auditorias/<uuid:pk>/', views.AuditoriaProveedorDetailView.as_view(), name='auditoria-detail'),
    path('auditorias/create/', views.AuditoriaProveedorCreateView.as_view(), name='auditoria-create'),
    path('auditorias/<uuid:pk>/update/', views.AuditoriaProveedorUpdateView.as_view(), name='auditoria-update'),
]
