import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CircleCheckBig, Loader2 } from "lucide-react";
import {
  SelectItem,
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { IBook, IUser, RootState } from "@/helper/types/type";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { assignedBook } from "@/redux/slices/adminSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import moment from "moment";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import showToast from "@/helper/helper";

interface Props {
  openFormAlert: boolean;
  closeAlert: Function;
}

const formSchema = Yup.object().shape({
  student: Yup.string().required("Student is required."),
  book: Yup.string().required("Book is required."),
  issue_date: Yup.date()
    .typeError("Issue date must be a valid date.")
    .required("Issue date is required."),
  return_date: Yup.date()
    .typeError("Return date must be a valid date.")
    .required("Return date is required."),
});

const AssignedBookCreate = React.memo(
  ({ openFormAlert, closeAlert }: Props) => {
    const dispatch = useDispatch();
    const books = useSelector(
      (state: RootState) => state.store.adminReducer.bookData
    );

    const userList = useSelector(
      (state: RootState) => state.store.authReducer.userData
    );

    const assigendBooks = useSelector(
      (state: RootState) => state.store.adminReducer.assignBookData
    );

    const filteredUserData = userList.filter(
      (user: IUser) => user.role === "user"
    );

    const filteredBookData = books.filter(
      (book: IBook) => Number(book.current_quantity) !== 0
    );
    const [loader, setLoader] = useState(false);

    const form = useForm<Yup.InferType<typeof formSchema>>({
      resolver: yupResolver(formSchema),
      defaultValues: {
        student: "",
        book: "",
        issue_date: undefined,
        return_date: undefined,
      },
    });

    const isBookAlreadyAssign = (userId: string, bookId: string) => {
      return assigendBooks.some(
        (aBook) =>
          aBook.student.id === userId &&
          aBook.book.id === bookId &&
          aBook.return_status !== "Returned"
      );
    };

    const onSubmit = async (values: Yup.InferType<typeof formSchema>) => {
      const { student, book } = values;
      if (isBookAlreadyAssign(student, book)) {
        return toast.error(
          "The same book has already been assigned to this student."
        );
      }
      const studentData = userList.find(
        (user: IUser) => user.id === values.student
      );
      const booktData = books.find((user: IBook) => user.id === values.book);
      setLoader(true);
      const body = {
        values: {
          ...values,
          student: studentData,
          book: booktData,
        },
      };
      await dispatch(assignedBook(body.values));
      showToast("Book successfully assigned...!", <CircleCheckBig />);
      setLoader(false);
      closeAlert();
      setLoader(false);
    };

    const filterPassedTime = (time: any) => {
      const currentDate = new Date();
      const selectedDate = new Date(time);
      return currentDate.getTime() < selectedDate.getTime();
    };

    const filterReturnPassedTime = (time: Date, issueDate: Date | null) => {
      if (!issueDate) return true;
      const issueTime = moment(issueDate).startOf("minute").toDate().getTime();
      const selectedTime = moment(time).startOf("minute").toDate().getTime();
      return selectedTime > issueTime;
    };

    return (
      <div>
        {" "}
        <Dialog open={openFormAlert}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Assigned Book</DialogTitle>
            </DialogHeader>
            <Card className="p-2">
              <CardContent className="mt-8">
                {" "}
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <div className="flex flex-col gap-5 md:flex-row">
                      <FormField
                        control={form.control}
                        name="student"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Student</FormLabel>
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger className="">
                                  <SelectValue placeholder="Select Book" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Search Student</SelectLabel>
                                    {filteredUserData.map((student) => (
                                      <SelectItem value={student.id}>
                                        {student.fullname}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="book"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Book</FormLabel>
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger className="">
                                  <SelectValue placeholder="Select Book" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Search Book</SelectLabel>
                                    {filteredBookData.map((book) => (
                                      <SelectItem value={book.id}>
                                        {book.title}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex flex-col gap-5 md:flex-row">
                      <FormField
                        control={form.control}
                        name="issue_date"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Issue Date</FormLabel>
                            <FormControl>
                              <div className="relative w-full">
                                <DatePicker
                                  selected={field.value || null}
                                  onChange={(date: Date | null) =>
                                    field.onChange(date)
                                  }
                                  placeholderText="Date Of Birth"
                                  wrapperClassName="w-full"
                                  className="w-full h-10 px-3 py-2 border rounded-md border-input bg-background text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                                  dateFormat="dd/MM/yyyy hh:mm aa"
                                  showTimeSelect
                                  minDate={new Date()}
                                  filterTime={filterPassedTime}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="return_date"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Return Date</FormLabel>
                            <FormControl>
                              <div className="relative w-full">
                                <DatePicker
                                  disabled={
                                    form.watch("issue_date") ? false : true
                                  }
                                  selected={field.value || null}
                                  onChange={(date: Date | null) =>
                                    field.onChange(date)
                                  }
                                  placeholderText="Date Of Birth"
                                  wrapperClassName="w-full"
                                  className="w-full h-10 px-3 py-2 border rounded-md border-input bg-background text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                                  dateFormat="dd/MM/yyyy hh:mm aa"
                                  showTimeSelect
                                  minDate={form.watch("issue_date")}
                                  filterTime={(time) =>
                                    filterReturnPassedTime(
                                      time,
                                      form.watch("issue_date")
                                    )
                                  }
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end items-center gap-3">
                      <Button
                        onClick={() => closeAlert()}
                        type="button"
                        variant="outline"
                        size={"lg"}
                      >
                        Cancel
                      </Button>
                      <Button size={"lg"} type="submit" disabled={loader}>
                        {loader && <Loader2 className="animate-spin" />}
                        Submit
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
);

export default AssignedBookCreate;
