import { Home, Settings, LibraryBig } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import librarylogo from "../../../assets/lmslogo.png";
import librarylogoNew from "../../../assets/lmsnew.png";
import { NavLink, useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const items = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: Home,
    submenu: null,
  },

  {
    title: "Book",
    url: "/admin/book/list",
    icon: LibraryBig,
    submenu: null,
  },
  {
    title: "Assigned Book",
    url: "/admin/book/assigned/list",
    icon: Settings,
    submenu: null,
  },
];

export function AppSidebar() {
  const location = useLocation();
  return (
    <Sidebar>
      <SidebarHeader className="py-3 mb-2 flex flex-row items-center justify-center">
        <div className="gap-1 flex items-center justify-center ">
          <img src={librarylogo} className="w-8 h-8" />{" "}
          <span className="font-bold text-lg bg-primary rounded-lg text-white">
            【ＬＭＳ】
          </span>
          <img src={librarylogo} className="w-8 h-8" />{" "}
        </div>
      </SidebarHeader>
      <Separator orientation="horizontal" />
      <SidebarContent className="mt-6">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        key={item.url}
                        className={`flex flex-row items-center gap-3 px-6 py-3 mb-2 hover:bg-primary hover:text-primary cursor-pointer transition-colors ${
                          isActive ? "bg-primary text-white" : ""
                        }`}
                        to={item.url}
                      >
                        <item.icon />
                        <span className="font-bold">{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
