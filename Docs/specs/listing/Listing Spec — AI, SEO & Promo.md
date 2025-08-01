# 🤖 Listing Spec — AI, SEO & Promo (v0.4)

> **Часть 2/2** — автоматическое SEO, AI‑подсказки и пакеты продвижения.

---

## 1. Автогенерация SEO‑полей

```python
MAX_TITLE_LEN = 255
META_DESC_LIMIT = 180  # Google рекомендует 150–160

@receiver(pre_save, sender=Listing)
def populate_seo(sender, instance, **kw):
    base = f"{instance.brand.name} {instance.car_model.name}, {instance.year}"
    instance.title = base[:MAX_TITLE_LEN]

    full = instance.safe_translation_getter("description_user", any_language=True) or ""
    cropped = full[:META_DESC_LIMIT]
    if len(full) > META_DESC_LIMIT and " " in cropped:
        cropped = cropped.rsplit(" ", 1)[0]
    # Добавляем ключевые фичи (A/C, ABS)
    features = ", ".join(instance.features.values_list("name", flat=True)[:2])
    if features:
        cropped += f". Оснащение: {features}"
    instance.description = cropped.strip()
```

---

## 2. AI‑помощник (app `assistant`)

| Файл                       | Назначение                                           |
| -------------------------- | ---------------------------------------------------- |
| `assistant/views.py`       | `ListingTipsViewSet` — анализ VIN, фото, description |
| `assistant/serializers.py` | `ListingDraftSerializer` с валидацией                |
| `assistant/router`         | маршрут `/ai/assistant/listing/tips/`                |

### 2.1 Пример запроса/ответа

```http
POST /ai/assistant/listing/tips/
```

**Request JSON** — черновик объявления (см. Ч. 1 пример POST)

**Response JSON**

```json
{
  "quality_score": 0.82,
  "suggestions": [
    {"field": "photos", "message": "Фото №2 размыто, попробуйте заменить."},
    {"field": "description_user", "message": "Укажите объём двигателя для большей информативности."}
  ],
  "vin_data": {
    "make": "Toyota",
    "model": "Corolla",
    "year": 2015,
    "engine": "1.6 VVT‑i"
  }
}
```

### 2.2 Алгоритм оценки качества

1. **VIN → CarVertical** (async, cache 24 ч).
2. **Фото**: резкость + размер ≥ 1024px.
3. **Description** ≥ 50 символов, нет стоп‑слов.
4. **Feature completeness**: чем больше заполнено, тем выше счёт.

---

## 3. Пакеты продвижения

| id | Название  | Длительность (дн.) | Цена USD |
| -- | --------- | ------------------ | -------- |
| 1  | VIP       | 7                  | 15       |
| 2  | Top       | 7                  | 7        |
| 3  | Highlight | 7                  | 4        |

### 3.1 Эндпоинты

| Метод  | URL                             | Описание                            |
| ------ | ------------------------------- | ----------------------------------- |
| `GET`  | `/api/promotions/types/`        | структура таблицы выше              |
| `POST` | `/api/listings/<slug>/promote/` | `{"promotion_id":1}` — создаёт счет |

---

## 4. UI/UX рекомендации

* **Score ≥ 0.8** — зелёная метка «Отличное объявление».
* **0.6 ≤ score < 0.8** — жёлтая, показываем top‑3 рекомендаций.
* **< 0.6** — красная, выводим checklist из всех suggestions.

---

## 5. TODO

* Фронт: интегрировать логику подсказок в форму `/profile/listings/new`.
* Бэк: webhook от платёжки → `Listing.is_promoted=True`.
