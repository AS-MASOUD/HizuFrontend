export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US").format(price) + " تومان";
}

export function toPersianDigits(num?: number | string | null): string {
  return toEnglishDigits(num);
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fa-IR-u-nu-latn", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  } catch {
    return toEnglishDigits(dateString);
  }
}

export function toEnglishDigits(str?: string | number | null): string {
  if (str === null || str === undefined) return "";
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  let res = str.toString();
  for (let i = 0; i < 10; i++) {
    res = res.replaceAll(persianDigits[i], i.toString()).replaceAll(arabicDigits[i], i.toString());
  }
  return res;
}

export { getImageUrl } from "./imageUrl";
