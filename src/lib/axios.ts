import axios, { AxiosError, type AxiosRequestConfig } from "axios";

const baseURL = import.meta.env.VITE_APP_BASE_URL;
import { toast } from "sonner";

if (!baseURL) {
  throw new Error("env.VITE_APP_BASE_URL is not defined");
}

type RequestConfig = Omit<AxiosRequestConfig, "url" | "method" | "data">;

type ApiErrorResponse = {
  status_code: number;
  message: string;
  is_success: false;
  error_details?: {
    type?: string;
    code?: string;
    detail?: string;
    attr?: string;
    fa_details?: string;
  };
  response: unknown;
};


const instance = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

instance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status;
    const faDetails =
      error.response?.data?.error_details?.fa_details;

    if (status && status >= 500) {
      toast.error("خطایی در سمت سرور رخ داده است");
    } else if (faDetails) {
      toast.error(faDetails);
    }

    return Promise.reject(error);
  },
);

async function get<TResponse>(
  url: string,
  config?: RequestConfig,
): Promise<TResponse> {
  const { data } = await instance.get<TResponse>(url, config);
  return data;
}

async function post<TResponse, TBody>(
  url: string,
  body?: TBody,
  config?: RequestConfig,
): Promise<TResponse> {
  const { data } = await instance.post<TResponse>(url, body, config);
  return data;
}

export const httpClient = {
  post,
  get,
};
