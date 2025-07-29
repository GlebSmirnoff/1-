from django.urls import path
from . import views

urlpatterns = [
    path('', views.home_view, name='home'),
    path('about/', views.about_us_view, name='about'),
    path('contact/', views.contact_us_view, name='contact'),
    path('terms/', views.terms_of_service_view, name='terms'),
    path('privacy/', views.privacy_policy_view, name='privacy'),
    path('cookies/', views.cookies_policy_view, name='cookies'),
    path('faq/', views.faq_view, name='faq'),
    path('advertise/', views.advertise_view, name='advertise'),
    path('return/', views.return_policy_view, name='return'),
    path('careers/', views.careers_view, name='careers'),
    path('partners/', views.partners_view, name='partners'),
    path('rules/', views.rules_view, name='rules'),
]
