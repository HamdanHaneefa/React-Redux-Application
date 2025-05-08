import { createSlice } from "@reduxjs/toolkit";

const initialState = []
 
const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
      getUsers: (state, action) => {
        return action.payload
      },
      addUser: (state, action) => {
        state.push(action.payload);
      }, 
      updateUser: (state, action) => {
        const index = state.findIndex(user => user._id === action.payload.id);
        if (index !== -1) {
          state[index] = action.payload;
        }
      },
      deleteUser: (state, action) => {
        return state.filter(user => user._id !== action.payload);
      }
    }
  });


export const {getUsers,addUser,deleteUser,updateUser} = adminSlice.actions
export default adminSlice.reducer