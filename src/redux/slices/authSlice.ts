import { IUserState } from "@/helper/types/type";
import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialState: IUserState = {
  userData: [],
  currentLoginUser: null,
};

const userSlice = createSlice({
  name: "users",
  initialState: initialState,
  reducers: {
    registerUser: (state, action) => {
      const { fullname, email, password, confirmpassword, role, dob } =
        action.payload;

      state.userData = [
        ...state.userData,
        {
          id: uuidv4(),
          fullname,
          email,
          password,
          confirmpassword,
          role,
          dob,
        },
      ];
    },
    loginUser: (state, action) => {
      state.currentLoginUser = action.payload;
    },
    logoutUser: (state) => {
      state.currentLoginUser = null;
    },
  },
});

export const { registerUser, loginUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
