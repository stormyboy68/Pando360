"use server"
import { SERVER_URL } from "@/bootstrap/const";
import { cookies } from "next/headers";

export interface IResponseWT<T = any> {
  success?: boolean;
  data?: T | null;
  message?: string;
  status?: number;
}
export const PostWT = async (
  uri: string,
  payload: Record<string, string | any> = {},
  headers: Record<string, string> = {}
): Promise<IResponseWT> => {
  const cookieStore = cookies();
  const token = (await cookieStore).get("access_token")?.value;
  
  if (!token) {
    throw new Error("No access token found");
  }
  const url = SERVER_URL + uri;
  const defaultHeaders = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": `Bearer ${token}`,
    ...headers
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: defaultHeaders,
      cache: 'no-store' //next: { revalidate: 0 }
    });
    if (!res.ok) {
      const errorData = (await res.json());
      if(errorData.message){
        return errorData;
      }
      throw new Error('Request failed');
    }

    return (await res.json());
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
};
export const GetWT = async (
  uri: string,
  headers: Record<string, string> = {}
): Promise<IResponseWT> => {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("access_token")?.value;
    
    if (!token) {
      return {
        success: false,
        message: "No access token found",
        status: 401
      };
    }

    const url = SERVER_URL + uri;
    const defaultHeaders = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
      ...headers
    };

    const requestOptions: RequestInit = {
      method: "GET",
      headers: defaultHeaders,
      cache: 'no-store',
    };

    const res = await fetch(url, requestOptions);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || 'Request failed',
        status: res.status,
        ...errorData
      };
    }

    return await res.json();
  } catch (error) {
    console.error("API Request Error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred',
      status: 500
    };
  }
};
