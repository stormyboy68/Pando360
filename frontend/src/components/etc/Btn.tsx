import type { ButtonHTMLAttributes, FC } from "react";

interface BtnProps {
  className?: string;
  type?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
  tiltle: string;
  name?: string;
  id?:string;
  [key:string]:any;
}

const Btn: FC<BtnProps> = ({ name,id,tiltle, className, type = "button", disabled ,...rest}) => {
  return (
    <button name={name} id={id} className={className} type={type} disabled={disabled} {...rest} >
      {tiltle}
    </button>
  );
};
export default Btn;
