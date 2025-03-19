import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CircleCheckBig, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addBook,
  clearValues,
  editBook,
  editBookInAssignedBookObj,
} from "@/redux/slices/adminSlice";
import { toast } from "react-toastify";
import { RootState } from "@/helper/types/type";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ToastSuccess from "@/components/shared/ToastMessage/ToastSuccess";
import showToast from "@/helper/helper";

const formSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, "Title must be at least 2 characters.")
    .required("Title is required."),
  description: Yup.string()
    .min(2, "Description must be at least 2 characters.")
    .required("Description is required."),
  quantity: Yup.number()
    .typeError("Quantity must be a number.")
    .required("Quantity is required.")
    .positive("Quantity must be greater than zero.")
    .integer("Quantity must be an integer."),
  author: Yup.string()
    .min(2, "Author must be at least 2 characters.")
    .required("Author is required."),
});

const BookCreate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const books = useSelector(
    (state: RootState) => state.store.adminReducer.bookData
  );
  const bookDetails = useSelector(
    (state: RootState) => state.store.adminReducer.editBookDetails
  );
  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      title: bookDetails ? bookDetails.title : "",
      description: bookDetails ? bookDetails.description : "",
      quantity: bookDetails ? bookDetails.quantity : 0,
      author: bookDetails ? bookDetails.author : "",
    },
  });

  async function onSubmit(values: Yup.InferType<typeof formSchema>) {
    try {
      if (bookDetails) {
        handleEditBook(values);
      } else {
        handleAddBook(values);
      }
    } catch (error: any) {
      setLoader(false);
    }
  }

  const handleEditBook = async (values: Yup.InferType<typeof formSchema>) => {
    setLoader(true);
    const isBookExist = books.some(
      (book: { id: string; title: string }) =>
        book.title === values.title && book.id !== bookDetails?.id
    );

    if (isBookExist) {
      setLoader(false);
      return toast.error("Book already exists with this title");
    }
    await dispatch(editBook({ values, bookId: bookDetails?.id }));
    await dispatch(
      editBookInAssignedBookObj({ values, bookId: bookDetails?.id })
    );

    showToast("Book successfully updated..!", <CircleCheckBig />);
    setLoader(false);
    navigate("/admin/book/list");
    setLoader(false);
  };

  const handleAddBook = async (values: Yup.InferType<typeof formSchema>) => {
    setLoader(true);
    const isBookExist = books.some(
      (book: { title: string }) => book.title === values.title
    );

    if (isBookExist) {
      setLoader(false);
      return toast.error("Book already exists with this title");
    }
    await dispatch(addBook(values));

    showToast("Book successfully created..!", <CircleCheckBig />);
    setLoader(false);
    navigate("/admin/book/list");
    setLoader(false);
  };

  const handleCancel = async () => {
    await dispatch(clearValues());
    navigate("/admin/book/list");
  };

  return (
    <div>
      {" "}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Create Book</CardTitle>
        </CardHeader>
        <CardContent>
          {" "}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Description</FormLabel>
                    <FormControl className="h-32">
                      <Textarea placeholder="Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-5 md:flex-row">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Quantity"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Author</FormLabel>
                      <FormControl>
                        <Input placeholder="Author" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-center items-center gap-3">
                <Button size={"lg"} type="submit" disabled={loader}>
                  {loader && <Loader2 className="animate-spin" />}
                  Submit
                </Button>
                <Button
                  onClick={() => handleCancel()}
                  type="button"
                  variant="outline"
                  size={"lg"}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookCreate;
