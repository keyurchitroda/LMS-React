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
import { useSelector } from "react-redux";
import NoRecord from "../../assets/norecord2.jpg";
import moment from "moment";
import { Badge } from "@/components/ui/badge";
import { CheckCheck, Frown, History } from "lucide-react";

const Home = () => {
  const users = useSelector(
    (state: RootState) => state.store.authReducer.currentLoginUser
  );

  const assignedBookList = useSelector(
    (state: RootState) => state.store.adminReducer.assignBookData
  );

  const renderStatus = (assignedBook: IAssignedBook) => {
    const newDate = moment().utc();
    const returnDate = moment(assignedBook.return_date).utc();
    let status;
    let color;
    switch (assignedBook.return_status) {
      case "Pending":
        if (newDate.isAfter(returnDate)) {
          status = (
            <>
              Delay <Frown size={18} />
            </>
          );
          color = "bg-destructive";
        } else {
          status = (
            <>
              Pending <History size={18} />
            </>
          );
          color = "bg-orange-500";
        }
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

  const filterStudentAssigned = assignedBookList.filter(
    (book) => book.student.id === users?.id
  );

  return (
    <div>
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
                <TableHead className="text-white">Book</TableHead>
                <TableHead className="text-white">Issue Date</TableHead>
                <TableHead className="text-white">Return Date</TableHead>
                <TableHead className="text-white">Return Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filterStudentAssigned.length > 0 ? (
                filterStudentAssigned.map((book: IAssignedBook) => (
                  <TableRow key={book.id}>
                    <TableCell>{book.book.title}</TableCell>
                    <TableCell>
                      {moment(book.issue_date).format("DD/MM/yyyy hh:mm a")}
                    </TableCell>
                    <TableCell>
                      {moment(book.return_date).format("DD/MM/yyyy hh:mm a")}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${renderStatus(book).color} `}>
                        {renderStatus(book).status}{" "}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
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
    </div>
  );
};

export default Home;
