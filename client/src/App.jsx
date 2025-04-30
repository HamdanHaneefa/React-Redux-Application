import React from 'react';
import { Navbar } from './components/Navbar';
import { Route, Routes } from 'react-router';
import Service from './pages/Service';
import {Counter} from './components/Counter'
import Todo from './components/Todo';
import Home from './pages/Home';
import SignUpPage from './pages/Signup';
import LoginPage from './pages/Login';



function App() {  
  return (
    <>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/signup' element={<SignUpPage/>} />
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/services' element={<Service/>} />
        <Route path='/services/counter' element={<Counter/>} />
        <Route path='/services/todo' element={<Todo/>} />
      </Routes>
    </>
  );
}

export default App;
