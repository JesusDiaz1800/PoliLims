from django.urls import path
from . import views

urlpatterns = [
    # No Conformidades
    path('no-conformidades/', views.NoConformidadListView.as_view(), name='no-conformidad-list'),
    path('no-conformidades/<uuid:pk>/', views.NoConformidadDetailView.as_view(), name='no-conformidad-detail'),
    path('no-conformidades/create/', views.NoConformidadCreateView.as_view(), name='no-conformidad-create'),
    path('no-conformidades/<uuid:pk>/update/', views.NoConformidadUpdateView.as_view(), name='no-conformidad-update'),
    path('no-conformidades/<uuid:pk>/delete/', views.NoConformidadDeleteView.as_view(), name='no-conformidad-delete'),
    path('no-conformidades/<uuid:pk>/cerrar/', views.NoConformidadCerrarView.as_view(), name='no-conformidad-cerrar'),
    
    # Acciones Correctivas
    path('acciones-correctivas/', views.AccionCorrectivaListView.as_view(), name='accion-correctiva-list'),
    path('acciones-correctivas/<uuid:pk>/', views.AccionCorrectivaDetailView.as_view(), name='accion-correctiva-detail'),
    path('acciones-correctivas/create/', views.AccionCorrectivaCreateView.as_view(), name='accion-correctiva-create'),
    path('acciones-correctivas/<uuid:pk>/update/', views.AccionCorrectivaUpdateView.as_view(), name='accion-correctiva-update'),
    path('acciones-correctivas/<uuid:pk>/completar/', views.AccionCorrectivaCompletarView.as_view(), name='accion-correctiva-completar'),
    
    # Auditorías
    path('auditorias/', views.AuditoriaListView.as_view(), name='auditoria-list'),
    path('auditorias/<uuid:pk>/', views.AuditoriaDetailView.as_view(), name='auditoria-detail'),
    path('auditorias/create/', views.AuditoriaCreateView.as_view(), name='auditoria-create'),
    path('auditorias/<uuid:pk>/update/', views.AuditoriaUpdateView.as_view(), name='auditoria-update'),
    
    # Condiciones Ambientales
    path('condiciones-ambientales/', views.CondicionAmbientalListView.as_view(), name='condicion-ambiental-list'),
    path('condiciones-ambientales/create/', views.CondicionAmbientalCreateView.as_view(), name='condicion-ambiental-create'),
    path('condiciones-ambientales/<uuid:pk>/', views.CondicionAmbientalDetailView.as_view(), name='condicion-ambiental-detail'),
]
