import { createStore, combineReducers, applyMiddleware } from "redux";
import testMiddleware from "./middleware/testMiddleware";
import logger from "redux-logger";


const appReducer = combineReducers({
    counter,
    todo,
    services,
})

//CounterReducers 
function counter(state = {count:0}, action){
    switch (action.type){
        case 'INC':
            return {count:state.count + 1}
        case "DEC":
            return {count:state.count - 1}
        default:
            return state
    }
}


//toDoReducer
function todo(state=[], action) {
    switch(action.type){
        case 'ENTER' :
            return [
                ...state,
                {
                    id: Date.now(),
                    text: action.payload,
                    completed: false
                }
            ]
        case "TOGGLE" :
            return state.map(todo => todo.id === action.payload ? {...todo, completed: !todo.completed} : todo)
        case "REMOVE" :
            return state.filter(todo => todo.id !== action.payload)
        case "CLEAR_COMPLETED":
            return state.filter(todo => !todo.completed)
        case 'RESTORE_TODOS':
            return state.filter(todo => !todo.completed)      
        case "MARK_COMPLETED":
            return state.map(todo => ({...todo, completed:true}));
        case 'UNMARK_ALL':
            return state.map(todo => ({ ...todo, completed: false }));
        default :
            return state
    }
}

function services(state,action){
    return [
        { name: "Counter", path: "/services/counter" },
        { name: "Todo", path: "/services/todo" },
        {name: "Fetch", path: "/services/fetch"}
    ];
}


function getData(state=[] , action){
   
}


const store = createStore(appReducer, applyMiddleware(logger));
export default store;