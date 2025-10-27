import { Outlet, ScrollRestoration } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main id="content" className="container mx-auto ">
<ScrollRestoration />
        <Outlet>{children}</Outlet>
      </main>
      <Footer />
    </>
  );
}
