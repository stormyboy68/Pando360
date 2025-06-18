import Link from "next/link";
import React from "react";
import { IMenuLinkDasbord } from "./navbar";

interface IButtonLink extends IMenuLinkDasbord {
  className?: string;
}

function ButtonLink({href,title,className,onClick}: IButtonLink) {
  return (
    <Link href={href} className={className} onClick={onClick}>
      {title}
    </Link>
  );
}

export default ButtonLink;
