import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IBook, RootState } from "@/helper/types/type";
import {
  clearValues,
  deleteBook,
  editDetails,
  serachBook,
  setBookCurrentPage,
} from "@/redux/slices/adminSlice";
import { Pen, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import NoRecord from "../../../assets/norecord2.jpg";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const BookList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [openAlet, setOpenAlert] = useState(false);
  const [bookId, seBookId] = useState("");
  const [searchBook, setSearchBook] = useState("");

  const state = useSelector((state: RootState) => state.store.adminReducer);

  const books = useSelector(
    (state: RootState) => state.store.adminReducer.bookData
  );
  const booksFilter = useSelector(
    (state: RootState) => state.store.adminReducer.filterBook
  );

  const assignedBookList = useSelector(
    (state: RootState) => state.store.adminReducer.assignBookData
  );

  const handleDeleteBook = async (isDelete: boolean) => {
    if (isDelete) {
      await dispatch(deleteBook(bookId));
      setOpenAlert(false);
      seBookId("");
    } else {
      setOpenAlert(false);
      seBookId("");
    }
  };

  const hadleOpenDeletAlet = (id: string) => {
    const isBookAssigned = assignedBookList.some(
      (assignedbook) =>
        assignedbook.book.id === id && assignedbook.return_status === "Pending"
    );
    if (!isBookAssigned) {
      setOpenAlert(true);
      seBookId(id);
    } else {
      toast.warn(
        "Book is assigned to student so you can not delete this book."
      );
    }
  };

  const handleSetEditDetails = async (bookId: string) => {
    await dispatch(editDetails(bookId));
    navigate("/admin/book/create");
  };

  const renderAlertDialog = () => {
    return (
      <AlertDialog open={openAlet}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure to delete this book?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your book from our stores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => handleDeleteBook(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive"
              onClick={() => handleDeleteBook(true)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };
  const handleFilterChange = async (value: string) => {
    setSearchBook(value);
    if (value) {
      await dispatch(serachBook(value));
    }
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(books.length / state.itemsPerPage);

    const handlePageChange = (page: number) => {
      dispatch(setBookCurrentPage(page));
    };

    return (
      <div className="pt-4 flex justify-end w-full">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (state.bookCurrentPage < totalPages + 1) {
                    handlePageChange(state.bookCurrentPage - 1);
                  }
                }}
                className={`${
                  state.bookCurrentPage === 1 &&
                  "opacity-50 pointer-events-none"
                }`}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  isActive={state.bookCurrentPage === index + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(index + 1);
                  }}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  if (state.bookCurrentPage < totalPages)
                    handlePageChange(state.bookCurrentPage + 1);
                }}
                className={`${
                  state.bookCurrentPage === totalPages &&
                  "opacity-50 pointer-events-none"
                }`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  };

  const startIndex = (state.bookCurrentPage - 1) * state.itemsPerPage;
  const paginatedData = books.slice(
    startIndex,
    startIndex + state.itemsPerPage
  );

  return (
    <div>
      <div className="flex justify-between items-center flex-wrap">
        <div className="flex items-center ">
          <Select value={searchBook} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select Book" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Search Book</SelectLabel>
                {books.map((book) => (
                  <SelectItem value={book.title}>{book.title}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button variant="ghost" onClick={() => setSearchBook("")}>
            Clear
          </Button>
        </div>
        <Button
          onClick={async () => {
            await dispatch(clearValues());
            navigate("/admin/book/create");
          }}
          size="lg"
        >
          Add Book
        </Button>
      </div>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Books</CardTitle>
          <CardDescription>book List</CardDescription>
        </CardHeader>
        <CardContent>
          <Table className="border">
            <TableCaption>A list of recent book.</TableCaption>
            <TableHeader className="bg-primary">
              <TableRow className="hover:bg-primary bg-primary">
                <TableHead className="text-white">Title</TableHead>
                <TableHead className="text-white">Description</TableHead>
                <TableHead className="text-white">Total Quantity</TableHead>
                <TableHead className="text-white">Current Quantity</TableHead>
                <TableHead className="text-white">Author</TableHead>
                <TableHead className="text-white">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(searchBook ? booksFilter : paginatedData).length > 0 ? (
                (searchBook ? booksFilter : paginatedData).map(
                  (book: IBook) => (
                    <TableRow key={book.id}>
                      <TableCell className="font-medium">
                        {book.title}
                      </TableCell>
                      <TableCell>{book.description}</TableCell>
                      <TableCell>{book.quantity}</TableCell>
                      <TableCell>{book.current_quantity}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell className="flex gap-2">
                        {" "}
                        <Button
                          onClick={() => handleSetEditDetails(book.id)}
                          variant="outline"
                          size="icon"
                        >
                          {" "}
                          <Pen />
                        </Button>
                        <Button
                          onClick={() => hadleOpenDeletAlet(book.id)}
                          variant="outline"
                          size="icon"
                        >
                          <Trash2 />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                )
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center hover:bg-white">
                    <img
                      src={NoRecord}
                      alt="No Record Found"
                      className="mx-auto h-[400px] w-[400px]"
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {!searchBook && renderPagination()}
      {renderAlertDialog()}
    </div>
  );
};

export default BookList;
