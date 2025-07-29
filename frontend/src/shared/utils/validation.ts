// src/shared/utils/validation.ts
import * as yup from 'yup';

// Валідатор для створення та редагування оголошення
export const listingSchema = yup.object({
  title: yup
    .string()
    .required("Заголовок обов'язковий")
    .min(5, "Мінімум 5 символів")
    .max(100, "Максимум 100 символів"),

  price: yup
    .number()
    .typeError("Ціна має бути числом")
    .required("Ціна обов'язкова")
    .min(0, "Ціна не може бути від'ємною"),

  year: yup
    .number()
    .typeError("Рік має бути числом")
    .required("Рік обов'язковий")
    .min(1900, "Рік не може бути раніше 1900")
    .max(new Date().getFullYear(), `Рік не може перевищувати ${new Date().getFullYear()}`),

  mileage: yup
    .number()
    .typeError("Пробіг має бути числом")
    .required("Пробіг обов'язковий")
    .min(0, "Пробіг не може бути від'ємним"),

  currency: yup
    .string()
    .oneOf(["UAH", "USD"], "Невірна валюта")
    .required("Валюта обов'язкова"),

  vin: yup
    .string()
    .nullable()
    .optional()
    .matches(/^[A-HJ-NPR-Z0-9]{17}$/, "VIN має бути 17 символів"),

  owners_count: yup
    .number()
    .typeError("К-ть власників має бути числом")
    .required("К-ть власників обов'язкова")
    .min(1, "Має бути хоча б 1 власник")
    .integer("Має бути цілим числом"),
});
