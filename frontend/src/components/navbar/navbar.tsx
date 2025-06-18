"use client";
import React from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useNotification } from "../etc/ToastNotification/useNotification";
import { logout } from "@/store/slices/user/userSlice";
import { VersionRoute } from "@/bootstrap/const";
import { usePathname, useRouter } from "next/navigation";
import { logoutAction } from "../auth/action";
import ButtonLink from "./buttonLink";
import ButtonDasboard from "./buttonDasboard";

export interface INavLink {
  name: string;
  path: string;
}
export interface IMenuLinkDasbord {
  href: string;
  title: string;
  onClick?: () => void;
}

export interface IStateNavbar {
  navLinks: INavLink[];
  menuLinkDasbord: IMenuLinkDasbord[];
}
const Navbar = () => {
  const user = useAppSelector((state) => state.user);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { showNotification } = useNotification();

  const handleLogout = async () => {
    const res = await logoutAction();
    if (res.success) {
      showNotification(res.message as string, "success");
            Cookies.remove("access_token");
      dispatch(logout());
      router.push(`${VersionRoute}/login`);
    }
    dispatch(logout());
    router.push(`${VersionRoute}/login`);
  };

  const menuLinkDasbord: IMenuLinkDasbord[] = [
    { href: "/", title: "پیشخوان" },
    ...(user.isSuperAdmin
      ? [{ href: "/admins", title: "نماینده‌ها" }]
      : []),
    {
      href: "#",
      title: "خروج",
      onClick: () => {
        if (confirm("آیا مطمئن هستید که می‌خواهید خارج شوید؟")) {
          handleLogout();
        }
      },
    },
  ];

  return (
    <>
      {user.isLogin ? (
        <nav>
          <div className="w-full bg-neutral-800">
            <div className=" w-full h-0 md:h-16 flex items-center justify-between px-9 md:py-2 py-0 border-b">
              <div className="flex justify-end items-center w-6/8"></div>
              <div className="flex justify-end items-center w-1/8">
                <div className="flex justify-start items-center space-x-1">
                  <ButtonDasboard menuLinkDasbord={menuLinkDasbord} />
                </div>
              </div>
            </div>
          </div>
        </nav>
      ) : (
        ""
      )}
    </>
  );
};

export default Navbar;
