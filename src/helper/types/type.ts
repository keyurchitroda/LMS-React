export interface IUser {
  id: string;
  fullname: string;
  email: string;
  password: string;
  confirmpassword: string;
  role: string;
  dob: Date | null;
}

export interface IUserState {
  userData: IUser[];
  currentLoginUser: IUser | null;
}

export interface IBook {
  id: string;
  title: string;
  description: string;
  quantity: number;
  current_quantity: number;
  author: string;
}

export interface IAssignedBook {
  id: string;
  student: IUser;
  book: IBook;
  issue_date: Date;
  return_date: Date;
  return_status: string;
}

export interface IBookState {
  bookData: IBook[];
  filterBook: IBook[];
  editBookDetails: IBook | null;
  assignBookData: IAssignedBook[];
  bookCurrentPage: number;
  itemsPerPage: number;
  assignedBookCurrentPage: number;
}

export interface RootState {
  store: {
    authReducer: IUserState;
    adminReducer: IBookState;
  };
}

export interface TostType {
  icon: undefined;
  className: string;
  progressClassName: string;
}
