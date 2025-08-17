import { PropsWithChildren } from "react";

import Footer from "@/components/layouts/footer/Footer";
import Nav from "@/components/layouts/nav/Nav";

export default function ApplicationLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Nav />
      <div className="container mx-auto px-4">{children}</div>
      <Footer />
    </>
  );
}
