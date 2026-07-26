import type {
  CustomerTheme,
  CustomerThemeUpdate,
} from "../types/theme";

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

async function request<T>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const body: ApiResponse<T> =
    await response.json();

  if (!response.ok) {
    throw new Error(
      body.message ??
        "Something went wrong.",
    );
  }

  return body.data;
}

export const customerThemeApi = {
  async getTheme(): Promise<CustomerTheme> {
    return request<CustomerTheme>(
      "/api/dashboard/customer-theme",
    );
  },

  async updateTheme(
    updates: CustomerThemeUpdate,
  ): Promise<CustomerTheme> {
    return request<CustomerTheme>(
      "/api/dashboard/customer-theme",
      {
        method: "PATCH",
        body: JSON.stringify(updates),
      },
    );
  },
};