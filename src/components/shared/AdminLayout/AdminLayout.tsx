import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Outlet, useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/redux/slices/authSlice";
import { RootState } from "@/helper/types/type";

export default function AdminLayout() {
  const users = useSelector(
    (state: RootState) => state.store.authReducer.currentLoginUser
  );
  const dipatch = useDispatch();
  const location = useLocation();
  const handleLogout = async () => {
    await dipatch(logoutUser());
  };

  console.log("location", location);

  const renderBreadCrumb = () => {
    let title;
    switch (location.pathname) {
      case "/admin/dashboard":
        title = "Dashboard";
        break;
      case "/admin/book/list":
        title = "Book List";
        break;
      case "/admin/book/create":
        title = "Book Create";
        break;
      case "/admin/book/assigned/list":
        title = "Assigned Book List";
        break;
    }
    return title;
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 flex-col overflow-hidden">
        <header className="flex justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/admin/dashboard">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{renderBreadCrumb()}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="mr-8">
              <Avatar className="border border-primary">
                <AvatarImage src="" alt="KC" />
                <AvatarFallback>KC</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-8">
              <DropdownMenuLabel className="max-w-[132px] truncate overflow-hidden text-ellipsi">
                {users?.fullname}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLogout()}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <Separator orientation="horizontal" />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 mt-4 overflow-auto">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
