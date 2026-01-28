from django.urls import path
from . import views

urlpatterns = [
    # Muestras
    path('muestras/', views.MuestraListView.as_view(), name='muestra-list'),
    path('muestras/<uuid:pk>/', views.MuestraDetailView.as_view(), name='muestra-detail'),
    path('muestras/create/', views.MuestraCreateView.as_view(), name='muestra-create'),
    path('muestras/<uuid:pk>/update/', views.MuestraUpdateView.as_view(), name='muestra-update'),
    path('muestras/<uuid:pk>/delete/', views.MuestraDeleteView.as_view(), name='muestra-delete'),
    
    # Ensayos
    path('', views.EnsayoListView.as_view(), name='ensayo-list'),
    path('<uuid:pk>/', views.EnsayoDetailView.as_view(), name='ensayo-detail'),
    path('create/', views.EnsayoCreateView.as_view(), name='ensayo-create'),
    path('<uuid:pk>/update/', views.EnsayoUpdateView.as_view(), name='ensayo-update'),
    path('<uuid:pk>/delete/', views.EnsayoDeleteView.as_view(), name='ensayo-delete'),
    path('<uuid:pk>/aprobar/', views.EnsayoAprobarView.as_view(), name='ensayo-aprobar'),
    
    # Resultados
    path('resultados/', views.ResultadoEnsayoListView.as_view(), name='resultado-list'),
    path('resultados/<uuid:pk>/', views.ResultadoEnsayoDetailView.as_view(), name='resultado-detail'),
    path('resultados/create/', views.ResultadoEnsayoCreateView.as_view(), name='resultado-create'),
    
    # Historial
    path('<uuid:pk>/historial/', views.HistorialEnsayoListView.as_view(), name='historial-list'),
]
