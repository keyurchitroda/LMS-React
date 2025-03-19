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
import { IAssignedBook, RootState } from "@/helper/types/type";

import { CheckCheck, CircleDot, Frown, History, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import NoRecord from "../../../assets/norecord2.jpg";

import { useCallback, useState } from "react";
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
import {
  deleteAssignedBook,
  returnAssignedBook,
  setAssignedBookCurrentPage,
} from "@/redux/slices/adminSlice";
import moment from "moment";
import { Badge } from "@/components/ui/badge";
import AssignedBookCreate from "./AssignedBookCreate";
import { toast } from "react-toastify";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PopoverClose } from "@radix-ui/react-popover";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const AssignedBookList = () => {
  const dispatch = useDispatch();

  const [openAlet, setOpenAlert] = useState(false);
  const [returnOpenAlet, setReturnOpenAlert] = useState(false);
  const [bookId, seBookId] = useState("");
  const [returnBookId, setReturnBookId] = useState("");
  const [openFormAlert, setOpenFormAlert] = useState(false);
  const state = useSelector((state: RootState) => state.store.adminReducer);

  const assignedBookList = useSelector(
    (state: RootState) => state.store.adminReducer.assignBookData
  );

  const handleDeleteAssignedBook = async (isDelete: boolean) => {
    if (isDelete) {
      await dispatch(deleteAssignedBook(bookId));
      setOpenAlert(false);
      seBookId("");
      setReturnBookId("");
      clearSearch();
    } else {
      setOpenAlert(false);
      seBookId("");
      setReturnBookId("");
    }
  };

  const handleReturnAssignedBook = async () => {
    await dispatch(returnAssignedBook({ bookId, returnBookId }));
    setReturnOpenAlert(false);
    seBookId("");
    setReturnBookId("");
    clearSearch();
  };

  const hadleOpenDeletAlert = (assignedBook: IAssignedBook) => {
    if (assignedBook.return_status === "Returned") {
      setOpenAlert(true);
      seBookId(assignedBook.id);
    } else {
      toast.warn(
        "You are not able to delete this assigned book because this book has not been returned by the student"
      );
    }
  };

  const hadleOpenRetrunAlert = (assignedBook: IAssignedBook) => {
    setReturnOpenAlert(true);
    seBookId(assignedBook.id);
    setReturnBookId(assignedBook.book.id);
  };

  const renderAlertDialog = () => {
    return (
      <AlertDialog open={openAlet}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure to delete this assigned book?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your book from our stores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => handleDeleteAssignedBook(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive"
              onClick={() => handleDeleteAssignedBook(true)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  const renderReturnAlertDialog = () => {
    return (
      <AlertDialog open={returnOpenAlet}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure to return this assigned book?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                seBookId("");
                setReturnBookId("");
                setReturnOpenAlert(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive"
              onClick={() => handleReturnAssignedBook()}
            >
              Return
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  const handleCloseFormAlert = useCallback(() => {
    setOpenFormAlert(false);
  }, []);

  const renderStatus = (assignedBook: IAssignedBook) => {
    let status;
    let color;
    switch (assignedBook.return_status) {
      case "Pending":
        status = (
          <>
            Pending <History size={18} />
          </>
        );
        color = "bg-orange-500";
        break;
      case "Returned":
        status = (
          <>
            Returned <CheckCheck size={18} />
          </>
        );
        color = "bg-green-500";
        break;
    }
    return { status, color };
  };

  const [searchBook, setSearchBook] = useState("");
  const [searchStudent, setSearchStudent] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [data, setData] = useState<IAssignedBook[]>([]);
  const [isFilterApply, setIsFilterApply] = useState(false);

  const handleFilterChange = async (value: string, type: string) => {
    switch (type) {
      case "book":
        setSearchBook(value);
        break;
      case "student":
        setSearchStudent(value);
        break;
      case "status":
        setSearchStatus(value);
        break;
    }
  };

  const clearSearch = () => {
    setSearchBook("");
    setSearchStudent("");
    setSearchStatus("");
    setIsFilterApply(false);
  };

  const getFilteredData = () => {
    const searchBookValue = searchBook.toLowerCase();
    const searchStudentValue = searchStudent.toLowerCase();
    const searchStatusValue = searchStatus.toLowerCase();

    return assignedBookList.filter((item) => {
      const matchesBook =
        searchBookValue === "" ||
        item.book.id.toLowerCase().includes(searchBookValue);
      const matchesStudent =
        searchStudentValue === "" ||
        item.student.id.toLowerCase().includes(searchStudentValue);
      const matchesStatus =
        searchStatusValue === "" ||
        item.return_status.toLowerCase().includes(searchStatusValue);

      return matchesBook && matchesStudent && matchesStatus;
    });
  };

  const applyFilter = () => {
    setIsFilterApply(true);
    const filterData = getFilteredData();
    setData(filterData);
  };

  const renderFilter = () => {
    const books = useSelector(
      (state: RootState) => state.store.adminReducer.bookData
    );
    const stundents = useSelector(
      (state: RootState) => state.store.authReducer.userData
    );
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`${isFilterApply && "border-primary text-primary"}`}
          >
            {isFilterApply && (
              <span className="text-primary">
                <CircleDot />
              </span>
            )}
            Filter
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 md:ml-64">
          <div className="grid gap-5">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Filter</h4>
              <p className="text-sm text-muted-foreground">
                Set the dimensions for the layer.
              </p>
            </div>
            <div className="grid gap-6">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="width">Book</Label>
                <Select
                  value={searchBook}
                  onValueChange={(e) => handleFilterChange(e, "book")}
                >
                  <SelectTrigger className="col-span-2 h-8">
                    <SelectValue placeholder="Select Book" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Search Book</SelectLabel>
                      {books.map((book) => (
                        <SelectItem value={book.id}>{book.title}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="maxWidth">Student</Label>
                <Select
                  value={searchStudent}
                  onValueChange={(e) => handleFilterChange(e, "student")}
                >
                  <SelectTrigger className="col-span-2 h-8">
                    <SelectValue placeholder="Select Student" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Search Student</SelectLabel>
                      {stundents.map((book) => (
                        <SelectItem value={book.id}>{book.fullname}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="height">Status</Label>
                <Select
                  value={searchStatus}
                  onValueChange={(e) => handleFilterChange(e, "status")}
                >
                  <SelectTrigger className="col-span-2 h-8">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Search Status</SelectLabel>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Returned">Returned</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="p-8 flex items-center gap-2 justify-center">
            <PopoverClose asChild>
              <Button onClick={clearSearch} size="lg" variant="outline">
                Clear
              </Button>
            </PopoverClose>
            <PopoverClose asChild>
              <Button onClick={applyFilter} size="lg">
                Save
              </Button>
            </PopoverClose>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(assignedBookList.length / state.itemsPerPage);

    const handlePageChange = (page: number) => {
      dispatch(setAssignedBookCurrentPage(page));
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
                  if (state.assignedBookCurrentPage < totalPages + 1) {
                    handlePageChange(state.assignedBookCurrentPage - 1);
                  }
                }}
                className={`${
                  state.assignedBookCurrentPage === 1 &&
                  "opacity-50 pointer-events-none"
                }`}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  isActive={state.assignedBookCurrentPage === index + 1}
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
                  if (state.assignedBookCurrentPage < totalPages)
                    handlePageChange(state.assignedBookCurrentPage + 1);
                }}
                className={`${
                  state.assignedBookCurrentPage === totalPages &&
                  "opacity-50 pointer-events-none"
                }`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  };

  const startIndex = (state.assignedBookCurrentPage - 1) * state.itemsPerPage;
  const paginatedData = assignedBookList.slice(
    startIndex,
    startIndex + state.itemsPerPage
  );

  return (
    <div>
      <div className="flex justify-between items-center">
        {renderFilter()}
        <Button
          onClick={async () => {
            setOpenFormAlert(true);
          }}
          size="lg"
        >
          Assigned Book
        </Button>
      </div>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Assigned Books</CardTitle>
          <CardDescription>assigned book List</CardDescription>
        </CardHeader>
        <CardContent>
          <Table className="border">
            <TableCaption>A list of recent assigned books.</TableCaption>
            <TableHeader className="bg-primary">
              <TableRow className="hover:bg-primary bg-primary">
                <TableHead className="text-white">Stundent</TableHead>
                <TableHead className="text-white">Book</TableHead>
                <TableHead className="text-white">Issue Date</TableHead>
                <TableHead className="text-white">Return Date</TableHead>
                <TableHead className="text-white">Return Status</TableHead>
                <TableHead className="text-white">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(isFilterApply ? data : paginatedData).length > 0 ? (
                (isFilterApply ? data : paginatedData).map(
                  (book: IAssignedBook) => (
                    <TableRow key={book.id}>
                      <TableCell className="font-medium">
                        {book.student.fullname}
                      </TableCell>
                      <TableCell>{book.book.title}</TableCell>
                      <TableCell>
                        {moment(book.issue_date).format("DD/MM/yyyy hh:mm a")}
                      </TableCell>
                      <TableCell>
                        {moment(book.return_date).format("DD/MM/yyyy hh:mm a")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${renderStatus(book).color} hover:${
                            renderStatus(book).color
                          } `}
                        >
                          {renderStatus(book).status}{" "}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex gap-2 items-center">
                        <Button
                          onClick={() => hadleOpenDeletAlert(book)}
                          variant="outline"
                          size="icon"
                        >
                          <Trash2 />
                        </Button>
                        {book.return_status !== "Returned" && (
                          <Button
                            onClick={() => hadleOpenRetrunAlert(book)}
                            className="bg-destructive"
                          >
                            Return
                          </Button>
                        )}
                        {book.return_status === "Pending" &&
                          moment()
                            .utc()
                            .isAfter(moment(book.return_date).utc()) && (
                            <>
                              <Badge className="bg-gray-600">
                                Delay <Frown size={18} />
                              </Badge>
                            </>
                          )}
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
      {!isFilterApply && renderPagination()}
      {renderAlertDialog()}
      {renderReturnAlertDialog()}
      {openFormAlert && (
        <AssignedBookCreate
          openFormAlert={openFormAlert}
          closeAlert={handleCloseFormAlert}
        />
      )}
    </div>
  );
};

export default AssignedBookList;
