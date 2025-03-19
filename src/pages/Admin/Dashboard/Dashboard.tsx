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
import { IAssignedBook, IUser, RootState } from "@/helper/types/type";
import { useSelector } from "react-redux";
import moment from "moment";
import {
  BookCopy,
  CheckCheck,
  Frown,
  History,
  Send,
  UserRound,
  UsersRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import NoRecord from "../../../assets/norecord2.jpg";

const Dashboard = () => {
  const userList = useSelector(
    (state: RootState) => state.store.authReducer.userData
  );

  const books = useSelector(
    (state: RootState) => state.store.adminReducer.bookData
  );

  const filteredUserData = userList.filter(
    (user: IUser) => user.role === "user"
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

  const cardList = [
    {
      lable: "Students",
      desc: "Total number of students",
      count: filteredUserData.length,
      color: "text-primary",
      icon: <UsersRound />,
    },
    {
      lable: "Books",
      desc: "Total number of books",
      count: books.length,
      color: "text-primary",
      icon: <BookCopy />,
    },
    {
      lable: "Assigned Books",
      desc: "Total number of assigned books",
      count: assignedBookList.length,
      color: "text-primary",
      icon: <Send />,
    },
  ];

  return (
    <>
      <div className="flex flex-wrap gap-4 items-center md:justify-start justify-center">
        {cardList.map((cards) => (
          <Card className="w-[300px] border-primary">
            <CardHeader>
              <div className={`flex justify-between items-center text-black`}>
                <CardTitle className="text-primary">{cards.lable}</CardTitle>
                <span className="text-primary">{cards.icon}</span>
              </div>
              <CardDescription>{cards.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <span
                className={`flex justify-center font-bold ${cards.color} text-2xl`}
              >
                <Badge className="text-xl"> {cards.count}</Badge>
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Assigned Books</CardTitle>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignedBookList.length > 0 ? (
                assignedBookList.map((book: IAssignedBook) => (
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

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Students</CardTitle>
          <CardDescription>stundent List</CardDescription>
        </CardHeader>
        <CardContent>
          <Table className="border">
            <TableCaption>A list of recent students.</TableCaption>
            <TableHeader className="bg-primary">
              <TableRow className="hover:bg-primary bg-primary">
                <TableHead className="text-white">Name</TableHead>
                <TableHead className="text-white">Email</TableHead>
                <TableHead className="text-white">DOB</TableHead>
                <TableHead className="text-white">Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUserData.map((users: IUser) => (
                <TableRow key={users.id}>
                  <TableCell className="font-medium">
                    {users.fullname}
                  </TableCell>
                  <TableCell>{users.email}</TableCell>
                  <TableCell>
                    {moment(users.dob).format("DD/MM/YYYY")}
                  </TableCell>
                  <TableCell>{users.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default Dashboard;
