import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    users: [],
    currentUser: {  
        name: '',
        email: '',
        isAdmin: false,
        phoneNumber: '',
        id: ''
    }
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUsers: (state, action) => {
            const { name, email, isAdmin, phoneNumber, _id,profileImage } = action.payload;
            console.log(profileImage)
            state.currentUser = {
                name: name || state.currentUser.name,
                email: email || state.currentUser.email,
                isAdmin: isAdmin || state.currentUser.isAdmin,
                phoneNumber: phoneNumber || state.currentUser.phoneNumber,
                id: _id || state.currentUser.id,
                profileImage: profileImage || state.currentUser.profileImage
            };
        },
        updatePhoneNumber: (state, action) => {
            state.currentUser.phoneNumber = action.payload;
        },
        resetUser:()=>initialState
    }
});


export const { setUsers, updatePhoneNumber, resetUser} = userSlice.actions;
export default userSlice.reducer;
