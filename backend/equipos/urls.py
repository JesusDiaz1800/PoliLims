from django.urls import path
from . import views

urlpatterns = [
    # Equipos
    path('', views.EquipoListView.as_view(), name='equipo-list'),
    path('<uuid:pk>/', views.EquipoDetailView.as_view(), name='equipo-detail'),
    path('create/', views.EquipoCreateView.as_view(), name='equipo-create'),
    path('<uuid:pk>/update/', views.EquipoUpdateView.as_view(), name='equipo-update'),
    path('<uuid:pk>/delete/', views.EquipoDeleteView.as_view(), name='equipo-delete'),
    
    # Calibraciones
    path('calibraciones/', views.CalibracionListView.as_view(), name='calibracion-list'),
    path('calibraciones/<uuid:pk>/', views.CalibracionDetailView.as_view(), name='calibracion-detail'),
    path('calibraciones/create/', views.CalibracionCreateView.as_view(), name='calibracion-create'),
    path('calibraciones/<uuid:pk>/update/', views.CalibracionUpdateView.as_view(), name='calibracion-update'),
    
    # Mantenimientos
    path('mantenimientos/', views.MantenimientoListView.as_view(), name='mantenimiento-list'),
    path('mantenimientos/<uuid:pk>/', views.MantenimientoDetailView.as_view(), name='mantenimiento-detail'),
    path('mantenimientos/create/', views.MantenimientoCreateView.as_view(), name='mantenimiento-create'),
    path('mantenimientos/<uuid:pk>/update/', views.MantenimientoUpdateView.as_view(), name='mantenimiento-update'),
    
    # Eventos de control
    path('eventos/', views.ControlEventoListView.as_view(), name='evento-list'),
    path('eventos/create/', views.ControlEventoCreateView.as_view(), name='evento-create'),
]
