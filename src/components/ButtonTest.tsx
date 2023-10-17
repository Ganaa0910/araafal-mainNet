import React, { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = {
  variant: "buy-ticket" | "view" | "submit";
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const ButtonTest: React.FC<ButtonProps> = ({ variant, children, ...props }) => {
  let colorClasses = "";

  function returnsClass(variant: string) {
    switch (variant) {
      case "buy-ticket":
        return "text-base bg-defaultGray border-lightGray px-[16px] py-[12px] h-[48px] hover:border-white";

      case "view":
        return "bg-gray-500 hover:bg-gray-700 text-white";

      case "submit":
        return "bg-white hover:bg-gray-100 text-gray-800 border border-gray-500";

      default:
        break;
    }
  }

  return (
    <button className={`px-4 py-2 rounded ${returnsClass(variant)}`}>
      {children}
    </button>
  );
};

export default ButtonTest;
