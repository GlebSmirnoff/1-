from django.shortcuts import render
from django.http import JsonResponse

# Сторінка Home – HTML-шаблон
def home_view(request):
    return render(request, 'main/home.html')

# Решта – JSON-сторінки для React (або можна повернути templates, якщо передумаєш)
def about_us_view(request):
    return JsonResponse({"title": "Про нас", "content": "Інформація про компанію..."})

def contact_us_view(request):
    return JsonResponse({"title": "Контакти", "content": "Email, телефони, форма зворотного зв'язку..."})

def terms_of_service_view(request):
    return JsonResponse({"title": "Користувацька угода", "content": "Правила користування платформою..."})

def privacy_policy_view(request):
    return JsonResponse({"title": "Політика конфіденційності", "content": "Обробка персональних даних..."})

def cookies_policy_view(request):
    return JsonResponse({"title": "Cookies Policy", "content": "Як сайт використовує cookies..."})

def faq_view(request):
    return JsonResponse({"title": "FAQ", "content": "Часті запитання та відповіді..."})

def advertise_view(request):
    return JsonResponse({"title": "Реклама", "content": "Умови розміщення реклами..."})

def return_policy_view(request):
    return JsonResponse({"title": "Повернення/Скарги", "content": "Умови повернення товарів..."})

def careers_view(request):
    return JsonResponse({"title": "Вакансії", "content": "Відкриті вакансії та контакти HR..."})

def partners_view(request):
    return JsonResponse({"title": "Партнерам", "content": "Співпраця зі СТО, дилерами, агрегаторами..."})

def rules_view(request):
    return JsonResponse({"title": "Правила розміщення оголошень", "content": "Для продавців авто, запчастин тощо..."})

