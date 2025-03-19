import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const HomeLayout = () => {
  return (
    <main className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-auto flex-col gap-4 p-4 pt-0 mt-4">
        <Outlet />
      </div>
      <Footer />
    </main>
  );
};

export default HomeLayout;
