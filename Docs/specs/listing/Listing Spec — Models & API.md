# 📄 Listing Spec — Models & API (v0.4)

> **Часть 1/2** — всё, что относится к структуре данных, REST‑эндпоинтам и фильтрации.

---

## 1. Django‑модели (ключевые фрагменты)

```python
class Feature(models.Model):
    name = models.CharField(max_length=64)

@register_snippet
class Listing(TranslatableModel, TimeStampedModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    translations = TranslatedFields(
        title       = models.CharField(max_length=255, editable=False),
        description = models.TextField(blank=True, editable=False),
    )

    # Core attrs
    brand     = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True)
    car_model = models.ForeignKey(CarModel, on_delete=models.SET_NULL, null=True)
    year      = models.PositiveSmallIntegerField()
    mileage   = models.PositiveIntegerField()
    price     = models.DecimalField(max_digits=12, decimal_places=2)
    currency  = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default="USD")

    # Details + options
    body_type    = models.ForeignKey(BodyType, on_delete=models.SET_NULL, null=True)
    engine       = models.ForeignKey(Engine, on_delete=models.SET_NULL, null=True)
    transmission = models.ForeignKey(Transmission, on_delete=models.SET_NULL, null=True)
    fuel_type    = models.ForeignKey(FuelType, on_delete=models.SET_NULL, null=True)
    drive_type   = models.ForeignKey(DriveType, on_delete=models.SET_NULL, null=True)
    color        = models.ForeignKey(Color, on_delete=models.SET_NULL, null=True, blank=True)
    vin          = models.CharField(max_length=17, blank=True, null=True)
    owners_count = models.PositiveSmallIntegerField(default=1)

    features = models.ManyToManyField(Feature, blank=True)  # кондиционер, ABS, …

    moderation_status = models.CharField(max_length=20, choices=MODERATION_STATUSES, default="pending")
    is_reserved = models.BooleanField(default=False)
    is_sold     = models.BooleanField(default=False)

    is_promoted    = models.BooleanField(default=False)
    promoted_type  = models.CharField(max_length=20, choices=PROMO_TYPES, null=True, blank=True)
    promoted_until = models.DateTimeField(null=True, blank=True)

    slug = models.SlugField(unique=True, blank=True)
```

### 1.1 Индексы

| Поля                           | Тип            | Назначение           |
| ------------------------------ | -------------- | -------------------- |
| brand, car\_model              | B‑Tree         | основная фильтрация  |
| year / price / mileage         | B‑Tree         | диапазоны            |
| moderation\_status (approved)  | partial B‑Tree | публичный каталог    |
| is\_promoted + promoted\_until | partial B‑Tree | сортировка VIP       |
| title + description (tsvector) | **GIN**        | полнотекстовый поиск |

---

## 2. REST‑эндпоинты

| Метод     | URL                             | Описание             | Auth   |
| --------- | ------------------------------- | -------------------- | ------ |
| GET       | `/api/listings/`                | каталог + фильтры    | public |
| GET       | `/api/listings/<slug>/`         | деталь               | public |
| POST      | `/api/listings/`                | создать (из профиля) | user   |
| PUT/PATCH | `/api/listings/<slug>/`         | обновить своё        | owner  |
| PATCH     | `/api/listings/<slug>/status/`  | смена статуса        | owner  |
| POST      | `/api/listings/<slug>/photos/`  | upload фото          | owner  |
| GET       | `/api/promotions/types/`        | список пакетов       | public |
| POST      | `/api/listings/<slug>/promote/` | купить пакет         | owner  |

### 2.1 Пример создания (`POST /api/listings/`)

```json
{
  "brand": 1,
  "car_model": 10,
  "year": 2015,
  "mileage": 122000,
  "price": "8200.00",
  "currency": "USD",
  "features": [1,3,7],
  "body_type": 3,
  "engine": 4,
  "fuel_type": "petrol",
  "transmission": "automatic",
  "drive_type": "fwd",
  "description_user": "Продам авто в идеальном состоянии…"
}
```

**Ответ 201**

```json
{
  "slug": "toyota-corolla-2015-2",
  "moderation_status": "pending",
  "title": "Toyota Corolla, 2015",
  "description": "Продам авто в идеальном состоянии…",
  "created_at": "2025-08-01T12:00:00Z"
}
```

---

### 2.2 Bulk Import (Excel)

| Метод  | URL                                     | Описание                                      | Auth        |
| ------ | --------------------------------------- | --------------------------------------------- | ----------- |
| `POST` | `/api/listings/import/`                 | загрузка Excel-файла; запускает Celery‑задачу | staff / org |
| `GET`  | `/api/listings/import/{job_id}/status/` | прогресс: running / done / error              | staff / org |

<details>
<summary>⚙️ Формат Excel <b>(лист Listings)</b></summary>

| A      | B       | C    | D      | E       | F     | … |
| ------ | ------- | ---- | ------ | ------- | ----- | - |
| brand  | model   | year | engine | mileage | price | … |
| Toyota | Corolla | 2015 | 1.6    | 120000  | 8200  | … |

`features` указываем через запятую (`ABS, A/C`), `photos` — URL‑ы через пробел.

</details>

> Шаблон: **`docs/specs/import/Import_Template.xlsx`** (отслеживается через Git LFS).

## 3. Фильтры каталога

| Параметр                                                     | Тип       | Пример               |
| ------------------------------------------------------------ | --------- | -------------------- |
| brand / car\_model (обяз.)                                   | slug      | `brand=toyota`       |
| year\_min / year\_max                                        | int       | `year_min=2010`      |
| mileage\_max                                                 | int       | `mileage_max=150000` |
| price\_min / price\_max                                      | int       | `price_max=10000`    |
| body\_type / fuel\_type / transmission / drive\_type / color | slug      | –                    |
| engine                                                       | id        | `engine=4`           |
| features                                                     | comma‑ids | `features=1,3,7`     |
| status                                                       | enum      | `status=approved`    |

---

## 4. Ошибки

| Код     | Сообщение         | HTTP |
| ------- | ----------------- | ---- |
| LIST001 | Listing not found | 404  |
| LIST002 | Validation error  | 400  |
| LIST003 | Permission denied | 403  |
| LIST004 | Promo expired     | 410  |

---

*См. часть 2 для SEO‑правил, AI‑помощника и логики продвижения.*
