import React, { useState } from "react";
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
import { CircleCheckBig, Eye, EyeOff, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import bcryptJS from "bcryptjs";
import { loginUser } from "@/redux/slices/authSlice";
import { RootState } from "@/helper/types/type";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import showToast from "@/helper/helper";

const formSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address.")
    .required("Email is required."),
  password: Yup.string()
    .min(4, "Password must be at least 4 characters.")
    .required("Password is required."),
});

const Signin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [passwordType, setPasswordType] = useState("password");
  const [loader, setLoader] = useState(false);
  const users = useSelector((state: RootState) => state.store.authReducer);
  const form = useForm<Yup.InferType<typeof formSchema>>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      password: "",
      email: "",
    },
  });

  async function onSubmit(values: Yup.InferType<typeof formSchema>) {
    try {
      setLoader(true);

      const usersDetails = users.userData.find(
        (user: { email: string }) => user.email === values.email
      );

      if (!usersDetails) {
        setLoader(false);
        return toast.error("User not found..!");
      }

      const validatePassword = await bcryptJS.compare(
        values.password,
        usersDetails.password
      );

      if (!validatePassword) {
        setLoader(false);
        return toast.error("Invalid username or password..!");
      } else {
        await dispatch(loginUser(usersDetails));
        showToast("User succefully login...!", <CircleCheckBig />);
        if (usersDetails.role === "user") {
          navigate("/home");
        } else {
          navigate("/admin/dashboard");
        }
        setLoader(false);
      }
    } catch (error: any) {
      setLoader(false);
      console.log("error>>>>>>>>>>>", error);
    }
  }

  const handleSetTypePassword = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Signin</CardTitle>
          <CardDescription>
            Sign in for library management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              <div className="flex justify-between items-center">
                <Button type="submit" disabled={loader}>
                  {loader && <Loader2 className="animate-spin" />}
                  Submit
                </Button>
                <Button
                  onClick={() => navigate("/auth/sign-up")}
                  type="button"
                  variant="ghost"
                >
                  Register
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signin;
