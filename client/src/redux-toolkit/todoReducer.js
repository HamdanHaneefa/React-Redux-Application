import { createSlice } from "@reduxjs/toolkit";



const todoSlice = createSlice({
    name: 'todos',
    initialState: [],
    reducers:{
        enter: (state,action) => {
            state.push({
                id: Date.now(),
                text: action.payload,
                completed: false
            })
        },
        toggle: (state,action) => {
            return state.map(todo => todo.id === action.payload ? {...todo, completed: !todo.completed} : todo)
        },
        remove : (state,action) => {
            return state.filter(todo => todo.id !== action.payload)
        },
        clearCompleted : (state) => {
            return state.filter(todo => !todo.completed)
        },
        markCompleted : (state) => {
            return state.map(todo => ({...todo, completed:true}));
        },
        unmarkAll : (state) => {
            return state.map(todo => ({ ...todo, completed: false }));
        }

    }
})


export default todoSlice.reducer

export const { 
    enter,
    toggle,
    remove,
    clearCompleted,
    markCompleted,
    unmarkAll
} = todoSlice.actions
