export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

let refreshing: Promise<boolean> | null = null;

// shared promise so parallel 401s only trigger one refresh
function refresh() {
  if (!refreshing) {
    refreshing = fetch("/api/auth/refresh", { method: "POST" })
      .then((r) => r.ok)
      .catch(() => false)
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
}

export async function api<T = unknown>(
  url: string,
  init?: RequestInit
): Promise<T> {
  let res = await fetch(url, init);

  if (res.status === 401 && !url.startsWith("/api/auth/")) {
    if (await refresh()) {
      res = await fetch(url, init);
    } else {
      window.location.href = "/login";
      throw new ApiError("Session expired", 401);
    }
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(data.error ?? "Something went wrong", res.status);
  }
  return data as T;
}