interface API<T = unknown> {
  route: string;
  method?: "POST" | "GET" | "DELETE" | "PUT";
  body?: T;
}

export async function api({ route, method = "GET", body }: API) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}${route}`, {
    method,
    headers: {
      "Content-type": "application/json",
    },
    ...(body !== undefined && { body: JSON.stringify(body) }),
  });

  return response;
}
