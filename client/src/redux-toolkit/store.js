import { configureStore } from '@reduxjs/toolkit'
import valueReducer from './counterReducer'
import servicesReducer from './servicesReducer'
import todoReducer from './todoReducer'
import userReducer from './userReducer'
import adminReducer from './adminReducer'

const store = configureStore({
    reducer: {
        value: valueReducer,
        services: servicesReducer,
        todos: todoReducer,
        user: userReducer,
        admin: adminReducer
    }
})

export default store
