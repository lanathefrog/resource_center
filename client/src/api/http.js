const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function request(path, options = {}) {
  const hasBody = options.body !== undefined && options.body !== null;

  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export async function graphRequest(query, variables = {}) {
  const response = await request("/graphql", {
    method: "POST",
    body: JSON.stringify({ query, variables })
  });

  if (response.errors?.length) {
    throw new Error(response.errors[0].message || "GraphQL request failed");
  }

  return response.data;
}

export const apiBaseUrl = API_URL;
