import { SERVER_URL } from "../bootstrap/const";
export const Post = async (
  uri: string,
  payload: Record<string, any> = {},
  headers: Record<string, string> = {}
): Promise<Record<string, any>> => {
  const url = SERVER_URL + uri;
    const defaultHeaders = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...headers
  };
  const res = await fetch(url, {
    method: "POST",
    credentials: 'include',
    body: JSON.stringify(payload),
    headers: defaultHeaders,
    next:{revalidate:0},
  });
    if (!res.ok) {
      const errorData = (await res.json());
      if(errorData.message){
        return errorData;
      }
      throw new Error('Request failed');
    }
  return (await res.json());
};
