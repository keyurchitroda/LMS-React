import { IBook, IBookState } from "@/helper/types/type";
import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialState: IBookState = {
  bookData: [],
  filterBook: [],
  editBookDetails: null,
  assignBookData: [],
  bookCurrentPage: 1,
  itemsPerPage: 5,
  assignedBookCurrentPage: 1,
};

const adminSlice = createSlice({
  name: "admin",
  initialState: initialState,
  reducers: {
    addBook: (state, action) => {
      state.bookData = [
        ...state.bookData,
        {
          ...action.payload,
          id: uuidv4(),
          current_quantity: action.payload.quantity,
        },
      ];
    },
    serachBook: (state, action) => {
      const searchBook = state.bookData.filter(
        (book) => book.title === action.payload
      );
      state.filterBook = searchBook;
    },
    deleteBook: (state, action) => {
      const deleteBook = state.bookData.filter(
        (book) => book.id !== action.payload
      );
      state.bookData = deleteBook;
    },
    editDetails: (state, action) => {
      const editBook = state.bookData.find(
        (book) => book.id === action.payload
      );
      const newBookObj = {
        ...editBook,
        quantity: Number(editBook?.quantity),
      };
      state.editBookDetails = newBookObj as IBook;
    },
    editBook: (state, action) => {
      const { values, bookId } = action.payload;
      const findAssignedBookDetails = state.assignBookData.filter(
        (assBook) =>
          assBook.book.id === bookId && assBook.return_status === "Pending"
      );
      const editedBooData = state.bookData.map((book) =>
        book.id === bookId
          ? {
              ...book,
              ...values,
              current_quantity:
                values.quantity - findAssignedBookDetails.length,
            }
          : book
      );
      state.bookData = editedBooData;
      state.editBookDetails = null;
    },
    assignedBook: (state, action) => {
      state.assignBookData = [
        ...state.assignBookData,
        {
          ...action.payload,
          id: uuidv4(),
          return_status: "Pending",
        },
      ];
      const editedBooKDQty = state.bookData.map((book) => {
        if (book.id === action.payload.book.id) {
          return {
            ...book,
            current_quantity: Number(book.current_quantity) - 1,
          };
        }
        return book;
      });
      state.bookData = editedBooKDQty as any;
    },
    clearValues: (state) => {
      state.editBookDetails = null;
    },
    deleteAssignedBook: (state, action) => {
      const deleteBook = state.assignBookData.filter(
        (book) => book.id !== action.payload
      );
      state.assignBookData = deleteBook;
    },
    returnAssignedBook: (state, action) => {
      const { bookId, returnBookId } = action.payload;
      const editedAssignedBookData = state.assignBookData.map((book) =>
        book.id === bookId ? { ...book, return_status: "Returned" } : book
      );
      state.assignBookData = editedAssignedBookData;

      const editedBooKDQty = state.bookData.map((book) => {
        if (book.id === returnBookId) {
          return {
            ...book,
            current_quantity: Number(book.current_quantity) + 1,
          };
        }
        return book;
      });
      state.bookData = editedBooKDQty as any;
    },
    editBookInAssignedBookObj: (state, action) => {
      const { values, bookId } = action.payload;
      const editedBooData = state.assignBookData.map((book) =>
        book.book.id === bookId
          ? {
              ...book,
              book: {
                ...book.book,
                ...values,
              },
            }
          : book
      );
      state.assignBookData = editedBooData;
    },
    setBookCurrentPage: (state, action) => {
      state.bookCurrentPage = action.payload;
    },
    setAssignedBookCurrentPage: (state, action) => {
      state.assignedBookCurrentPage = action.payload;
    },
  },
});

export const {
  serachBook,
  addBook,
  deleteBook,
  editDetails,
  clearValues,
  editBook,
  assignedBook,
  deleteAssignedBook,
  returnAssignedBook,
  editBookInAssignedBookObj,
  setBookCurrentPage,
  setAssignedBookCurrentPage,
} = adminSlice.actions;
export default adminSlice.reducer;
