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

export function getOrderStatusBadge(status: number): {
  bg: string;
  label: string;
} {
  switch (status) {
    case 0:
      return {
        bg: "bg-amber-100 text-amber-800 border-amber-300",
        label: "در انتظار پرداخت / تایید",
      };
    case 1:
      return {
        bg: "bg-blue-100 text-blue-800 border-blue-300",
        label: "در حال آماده‌سازی و ساخت",
      };
    case 2:
      return {
        bg: "bg-purple-100 text-purple-800 border-purple-300",
        label: "ارسال شده با پست",
      };
    case 3:
      return {
        bg: "bg-emerald-100 text-emerald-800 border-emerald-300",
        label: "تحویل داده شده به مشتری",
      };
    case 4:
      return {
        bg: "bg-rose-100 text-rose-800 border-rose-300",
        label: "لغو شده",
      };
    default:
      return {
        bg: "bg-gray-100 text-gray-700 border-gray-300",
        label: "نامشخص",
      };
  }
}

export { getImageUrl } from "./imageUrl";

