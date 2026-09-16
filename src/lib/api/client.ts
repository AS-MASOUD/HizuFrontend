const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("hizu_token");
  }
  return null;
}

export function setAuthToken(token: string | null): void {
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem("hizu_token", token);
    } else {
      localStorage.removeItem("hizu_token");
    }
  }
}

interface RequestOptions extends RequestInit {
  token?: string | null;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token: customToken, headers, ...customConfig } = options;

  const token = customToken !== undefined ? customToken : getAuthToken();

  const isFormData = customConfig.body instanceof FormData;
  const reqHeaders: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(headers as Record<string, string>),
  };

  if (token) {
    reqHeaders["Authorization"] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`;

  const response = await fetch(url, {
    ...customConfig,
    headers: reqHeaders,
  });

  if (response.status === 204) {
    return {} as T;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage =
      data?.detail ||
      data?.title ||
      data?.message ||
      (response.status === 401
        ? "نشست کاربری شما منقضی شده یا وارد نشده‌اید. لطفاً وارد شوید."
        : response.status === 403
        ? "شما دسترسی مجاز برای انجام این عملیات را ندارید."
        : response.status === 404
        ? "مورد درخواستی یافت نشد."
        : response.status >= 500
        ? "خطای داخلی سرور رخ داد. لطفاً لحظاتی بعد تلاش کنید."
        : `خطا در برقراری ارتباط (کد: ${response.status})`);

    throw new ApiError(errorMessage, response.status, data);
  }

  return data as T;
}
