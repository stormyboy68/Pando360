import { SERVER_URL } from "../bootstrap/const";
export const Post = async (
  uri: string,
  payload: Record<string, any> = {},
  headers: Record<string, string> = {}
): Promise<Record<string, any>> => {
  const url = SERVER_URL + uri;

  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...headers,
  };

  console.log(url)

  try {
    const res = await fetch(url, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(payload),
      headers: defaultHeaders,
      next: { revalidate: 0 },
    });
    console.log(res)
    let json;
    try {
      json = await res.json();
    } catch (e) {
      json = { message: "Invalid JSON response" };
    }

    if (!res.ok) {
      if (json.message) return json;
      throw new Error("Request failed");
    }

    return json;
  } catch (err: any) {
    console.error("Fetch failed:", err.message);
    throw err;
  }
};
