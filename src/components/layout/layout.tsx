import { ReactNode } from "react";
import Footer from "../Footer";
import Navbar from "../Navbar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col w-full h-screen">
      <Navbar />
      <div>{children}</div>
      <Footer />
    </div>
  );
}
