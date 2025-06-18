"use server";
import { REMEMBER_ME, VersionRoute_USER } from "@/bootstrap/const";
import { LoginFormSchema } from "@/lib/definitions";
import { Post } from "@/Rotuer/RouteOut";
import { GetWT, PostWT } from "@/Rotuer/RouteOutWT";
import { cookies } from "next/headers";


export interface IvalidatedFields {
  phone_number?: string[];
  password?: string[];
}

export interface IStateLogin<T = any> {
  data?: T | null;
  message?: string;
  success?: boolean;
  errors?: IvalidatedFields;
  access_token?: string;
}
export interface IStateReister extends IStateLogin {}
export type IgetInfoUser = Omit<IStateLogin, "errors">;

export const LoginAuthAction = async (
  prevState: IStateLogin,
  formData: FormData
): Promise<IStateLogin> => {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      data: [],
      message: "Missing or incorrect fields. Failed to create event.",
    };
  }

  const payload = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    const response = await Post(`/login`, payload);

    if (response.success) {
      await setToken(response.data.access_token);
      return {
        data: response.data.user ?? null,
        access_token: response.data.access_token ?? null,
        message: response.message ?? "",
        success: true,
      };
    } else {
      return {
        success: false,
        message: response.message ?? "Login failed.",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error?.message ?? "Unexpected error occurred.",
    };
  }
};

export const logoutAction = async (): Promise<any> => {
  try {
    const response = await PostWT(`/logout`);

    if (response?.success || response?.message === "Unauthenticated.") {
      const cookieStore = cookies();
      (await cookieStore).delete("access_token");
    }

    return {
      data: response?.data ?? null,
      message: response?.message ?? "",
      success: response?.success ?? false,
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error?.message ?? "Unknown Error",
    };
  }
};

export const getUserInfoAction = async (): Promise<IgetInfoUser> => {
  try {
    const response = await GetWT(`/userInfo`);

    if (response?.message === "Unauthenticated.") {
      const cookieStore = cookies();
      (await cookieStore).set("access_token",'');
      return {
        success: false,
        data: [],
        message: response?.message ?? "",
      };
    }

    return {
      data: response?.data ?? [],
      message: response?.message ?? "",
      success: response?.success,
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error?.message ?? "Unknown Error",
    };
  }
};

const setToken = async (token: string): Promise<void> => {
  const cookieStore = cookies();
  (await cookieStore).set({
    name: "access_token",
    value: token,
    httpOnly: process.env.NODE_ENV === "production",
    secure: process.env.NODE_ENV === "production", // یا true اگر لوکال https
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * REMEMBER_ME,
  });
};
