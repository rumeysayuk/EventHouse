const requiredError = (value) => `Lütfen ${value} alanını doldurunuz`;
const EMAIL_UNIQUE_ERROR = `Girilen email adresi sistemimizde zaten kayıtlı`;
const PLEASE_PROVIDE_EMAIL = "Lütfen geçerli bir email giriniz";
const minLengthError = (field, min) =>
  `${field} alanı en az ${min} karakter olmalıdır`;
const MIN_PRICE_ERROR = "Ürün fiyatı 0'dan küçük olamaz";
const MIN_QUANTITY_PER_UNIT_ERROR =
  "Ürün birim adedi en az 2 karakter olmalıdır";

module.exports = {
  requiredError,
  EMAIL_UNIQUE_ERROR,
  MIN_QUANTITY_PER_UNIT_ERROR,
  MIN_PRICE_ERROR,
  minLengthError,
  PLEASE_PROVIDE_EMAIL,
};
