from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class ListingSuggestionView(APIView):
    def post(self, request):
        brand = request.data.get("brand")
        model = request.data.get("model")
        year = request.data.get("year")
        engine = request.data.get("engine")

        if not all([brand, model, year, engine]):
            return Response({"error": "Усі поля обов'язкові: brand, model, year, engine"}, status=status.HTTP_400_BAD_REQUEST)

        # 🔮 Заглушка — тут буде AI-логіка
        suggested_price = 10000 + int(year) * 3
        description = f"{brand} {model} {year} з {engine} двигуном — чудовий вибір для українських доріг."

        return Response({
            "suggested_price": suggested_price,
            "description": description
        })

class SuggestView(APIView):
    def post(self, request):
        data = request.data
        brand = data.get("brand")
        model = data.get("model")
        year = data.get("year")
        engine = data.get("engine")

        if not all([brand, model, year, engine]):
            return Response(
                {"error": "Необхідні поля: brand, model, year, engine"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 🔮 Проста логіка-заглушка
        suggested_price = 10000  # TODO: розраховувати на основі year/engine
        description = f"{brand} {model} {year} року з двигуном {engine} в чудовому стані. Ідеально підходить для міста та подорожей."

        return Response({
            "description": description,
            "price": suggested_price,
            "recommendations": {
                "mileage": "до 150 тис. км",
                "transmission": "автомат",
                "drive_type": "передній"
            }
        })