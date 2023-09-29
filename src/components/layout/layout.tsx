import Navbar from "../Navbar";
import { ReactNode } from "react";

export default function Layout({ children }:{children:ReactNode}) {
  return (
    <div className="flex flex-col w-full h-screen">
      <Navbar />
      <div>{children}</div>
    </div>
  );
}
