"use client";
import {useActionState, useEffect, useState} from "react";
import Cookies from "js-cookie";
import {useDispatch} from "react-redux";
import {useRouter} from "next/navigation";
import {APP_NAME, REMEMBER_ME, SERVER_URL} from "@/bootstrap/const";
import {useNotification} from "../etc/ToastNotification/useNotification";
import {IStateLogin, LoginAuthAction} from "./action";
import {useAppSelector} from "@/store/hooks";
import {login} from "@/store/slices/user/userSlice";

const initialState: IStateLogin = {};
export default function LoginForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const {showNotification} = useNotification();
    const user = useAppSelector((state) => state.user);
    const dispatch = useDispatch();
    const [state, action, pending] = useActionState<IStateLogin<any>, FormData>(
        LoginAuthAction,
        initialState
    );
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    useEffect(() => {
        if (state?.message) {
            showNotification(
                state.message as string,
                state.success ? "success" : "error"
            );
        }
        if (state.success) {
            // Cookies.set("access_token", state.access_token || "", {
            //     secure: true,
            //     sameSite: "lax",
            //     path: "/",
            // });
            dispatch(login({user: state.data}));
            router.push("/");
        }
    }, [state]);

    return (
        <div className="min-h-screen flex items-center justify-center py-2 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-100">
                        ورود به حساب کاربری
                    </h2>
                </div>
                <form className="mt-8 space-y-6" action={action}>
                    {error && (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="text-sm text-red-700">{error}</div>
                        </div>
                    )}
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                name="email"
                                type="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="ایمیل"
                                value={formData.email}
                                onChange={handleChange}
                                dir="ltr"
                            />
                        </div>
                        <div>
                            <input
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="رمز عبور"
                                value={formData.password}
                                onChange={handleChange}
                                dir="ltr"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            ورود
                        </button>
                    </div>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"/>
                            </div>
                            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">
                  {APP_NAME}
                </span>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
