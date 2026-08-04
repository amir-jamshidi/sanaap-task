import axios, { type AxiosRequestConfig } from "axios";

const baseURL = import.meta.env.VITE_APP_BASE_URL;

if (!baseURL) {
  throw new Error("env.VITE_APP_BASE_URL is not defined");
}

type RequestConfig = Omit<AxiosRequestConfig, "url" | "method" | "data">;

const instance = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

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
