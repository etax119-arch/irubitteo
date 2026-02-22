const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1';

export async function serverFetch<T>(path: string, revalidate = 300): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    next: { revalidate },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  return json as T;
}
