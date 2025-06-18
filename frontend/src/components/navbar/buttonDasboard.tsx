import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import avatar from "@/app/img/user_icon.png";
import ButtonLink from "./buttonLink";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { IStateNavbar } from "./navbar";
import { FaUserCircle } from "react-icons/fa";

function ButtonDasboard({ menuLinkDasbord }: Omit<IStateNavbar, "navLinks">) {
  const [menu, setMenu] = useState(false);
  const email = useAppSelector((state) => state.user.userData?.email);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathName = usePathname();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenu(false);
      }
    };
    if (menu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menu]);

  return (
    <div
      onMouseEnter={() => setMenu(true)}
      className="relative inline-block text-center"
      ref={menuRef}
    >
      <div>
        <FaUserCircle size={40} className="text-amber-300" />
      </div>
      <div
        onMouseLeave={() => setMenu(false)}
        className="absolute right-0 mt-3 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-hidden"
      >
        <div className={` flex flex-col space-y-1  ${menu ? "" : "hidden"}`}>
          <p
            className={` block w-full px-4 py-2 rounded-b-xl font-black text-gray-900 bg-amber-400 overflow-hidden text-ellipsis whitespace-nowrap`}
          >
            {email}
          </p>
          {menuLinkDasbord.map((item) => (
            <ButtonLink
              key={item.href}
              href={item.href}
              title={item.title}
              onClick={item.onClick}
              className={`${
                pathName === item.href
                  ? "bg-indigo-500 text-gray-50"
                  : " text-gray-700"
              }
                block w-full font-black text-base px-4 py-2 hover:bg-blue-500 hover:text-white hover:rounded`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ButtonDasboard;
