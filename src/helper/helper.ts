import moment from "moment";
import { toast, ToastOptions } from "react-toastify";

const MIN_AGE = 18;
export const maxDate = moment().subtract(MIN_AGE, "years").toDate();

const showToast = (message: string, icon?: JSX.Element | string | number) => {
  const toastOptions: ToastOptions = {
    className: "text-primary",
    progressClassName: "bg-primary",
    icon: icon as any,
  };

  toast.success(message, toastOptions);
};

export default showToast;
