import { createSlice } from '@reduxjs/toolkit'


const servicesSlice = createSlice({
    name: 'services',
    initialState: [
        { name: "Counter", path: "/services/counter" },
        { name: "Todo", path: "/services/todo" },
        {name: "Fetch", path: "/services/fetch"}
    ],
    reducers: (state) =>{
        return state
    }
})


export default servicesSlice.reducer


