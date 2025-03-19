import { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import bcryptJS from "bcryptjs";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/redux/slices/authSlice";
import { CircleCheckBig, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import showToast, { maxDate } from "@/helper/helper";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { RootState } from "@/helper/types/type";

const formSchema = Yup.object().shape({
  fullname: Yup.string()
    .min(2, "Full name must be at least 2 characters.")
    .required("Full name is required."),
  email: Yup.string()
    .email("Invalid email address.")
    .required("Email is required."),
  password: Yup.string()
    .min(4, "Password must be at least 4 characters.")
    .required("Password is required."),
  confirmpassword: Yup.string()
    .min(4, "Confirm password must be at least 4 characters.")
    .oneOf([Yup.ref("password")], "Passwords must match.")
    .required("Confirm password is required."),
  role: Yup.string().required("Role is required."),
  dob: Yup.date()
    .typeError("Date of birth is required.")
    .required("Date of birth is required."),
});

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");
  const users = useSelector(
    (state: RootState) => state.store.authReducer.userData
  );
  const form = useForm<Yup.InferType<typeof formSchema>>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      fullname: "",
      password: "",
      confirmpassword: "",
      email: "",
      role: "",
      dob: undefined,
    },
  });

  async function onSubmit(values: Yup.InferType<typeof formSchema>) {
    try {
      setLoader(true);
      const isUserExist = users.some(
        (user: { email: string }) => user.email === values.email
      );

      if (isUserExist) {
        setLoader(false);
        return toast.error("User already registered with this email");
      }
      const salt = await bcryptJS.genSalt(10);
      const hashedPassword = await bcryptJS.hash(values.password, salt);
      const body = {
        values: {
          ...values,
          password: hashedPassword,
          confirmpassword: hashedPassword,
        },
      };

      await dispatch(registerUser(body.values));
      showToast("User successfully registerd..!", <CircleCheckBig />);
      setLoader(false);
      navigate("/auth/sign-in");
    } catch (error: any) {
      setLoader(false);
    }
  }

  const handleSetTypePassword = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  const handleSetTypeConfirmPassword = () => {
    setConfirmPasswordType(
      confirmPasswordType === "password" ? "text" : "password"
    );
  };

  return (
    <div className="flex items-center justify-center mt-8">
      <Card className="w-[550px]">
        <CardHeader>
          <CardTitle>Signup</CardTitle>
          <CardDescription>
            Sign up for library management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Password"
                          type={passwordType}
                          {...field}
                        />
                        <span
                          onClick={handleSetTypePassword}
                          className="absolute inset-y-0 right-0  flex items-center px-8 cursor-pointer"
                        >
                          {passwordType === "password" ? (
                            <Eye className="h-6 w-6" />
                          ) : (
                            <EyeOff />
                          )}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmpassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Confirm Password"
                          type={confirmPasswordType}
                          {...field}
                        />
                        <span
                          onClick={handleSetTypeConfirmPassword}
                          className="absolute inset-y-0 right-0  flex items-center px-8 cursor-pointer"
                        >
                          {confirmPasswordType === "password" ? (
                            <Eye className="h-6 w-6" />
                          ) : (
                            <EyeOff />
                          )}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Date Of Birth</FormLabel>
                    <FormControl>
                      <div className="relative w-full">
                        <DatePicker
                          selected={field.value || null}
                          onChange={(date: Date | null) => field.onChange(date)}
                          placeholderText="Date Of Birth"
                          dateFormat="dd/MM/yyyy"
                          wrapperClassName="w-full"
                          className="w-full h-10 px-3 py-2 border rounded-md border-input bg-background text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                          showYearDropdown
                          yearDropdownItemNumber={30}
                          scrollableYearDropdown
                          maxDate={maxDate}
                          // minDate={minDate}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Roles</SelectLabel>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="user">Student</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between items-center">
                <Button type="submit" disabled={loader}>
                  {loader && <Loader2 className="animate-spin" />}
                  Submit
                </Button>
                <Button
                  onClick={() => navigate("/auth/sign-in")}
                  type="button"
                  variant="ghost"
                >
                  Login
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
