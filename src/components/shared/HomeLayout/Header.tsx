import { Button } from "@/components/ui/button";
import librarylogo from "../../../assets/lmslogo.png";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/redux/slices/authSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RootState } from "@/helper/types/type";

const Header = () => {
  const dipatch = useDispatch();
  const handleLogout = async () => {
    await dipatch(logoutUser());
  };
  const users = useSelector(
    (state: RootState) => state.store.authReducer.currentLoginUser
  );
  return (
    <header className="w-full p-5 shadow-md shadow-zinc-200">
      <div className="wrapper flex items-center justify-between">
        {" "}
        <div className="gap-1 flex items-center justify-center rounded-lg ">
          <img src={librarylogo} className="w-8 h-8" />{" "}
          <span className="font-bold text-lg bg-primary rounded-lg text-white">
            【ＬＭＳ】
          </span>
          <img src={librarylogo} className="w-8 h-8" />{" "}
        </div>
        <div className="flex item-center gap-3 ">
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
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
        </div>
      </div>
    </header>
  );
};

export default Header;
