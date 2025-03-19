import { CircleCheckBig } from "lucide-react";
import { toast } from "react-toastify";

const ToastSuccess = ({ message }: { message: string }) => {
  toast.success(message, {
    className: "text-primary",
    progressClassName: "bg-primary",
    icon: <CircleCheckBig />,
  });
  return <></>;
};

export default ToastSuccess;
