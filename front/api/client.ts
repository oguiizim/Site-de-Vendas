type ApiFetchOptions = RequestInit & {
  errorMessage?: string;
};

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const {
    errorMessage = "Nao foi possivel completar a requisicao.",
    headers,
    ...requestOptions
  } = options;

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const response = await fetch(`${baseUrl}${path}`, {
    ...requestOptions,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      typeof data?.message === "string" ? data.message : errorMessage,
    );
  }

  return data as T;
}
