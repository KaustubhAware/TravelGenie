import { API_BASE } from "./httpClient";

export async function publicRequest(
  path,
  options = {}
) {
  const res = await fetch(
    `${API_BASE}${path}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data?.detail ||
      data?.message ||
      "Request failed"
    );
  }

  return data;
}
