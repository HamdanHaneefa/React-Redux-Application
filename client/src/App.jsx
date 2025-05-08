import React, { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Route, Routes } from 'react-router';
import Service from './pages/Service';
import {Counter} from './components/Counter'
import Todo from './components/Todo';
import UserDashboard from './pages/UserDashboard';
import SignUpPage from './pages/Signup';
import LoginPage from './pages/Login';
import About from './pages/About';
import FetchData from './components/FetchData';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import Logout from './components/Logout';

function App() {  
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<UserDashboard />} />
        <Route path="/services" element={<PrivateRoute><Service /></PrivateRoute>} />
        <Route path="/services/counter" element={<PrivateRoute><Counter /></PrivateRoute>} />
        <Route path="/services/todo" element={<PrivateRoute><Todo /></PrivateRoute>} />
        <Route path="/services/fetch" element={<PrivateRoute><FetchData /></PrivateRoute>} />
        <Route path="/about" element={<PrivateRoute><About /></PrivateRoute>} />

        <Route path='/admin' element={<AdminDashboard/>} />
        <Route path='/logout' element={<Logout/>} />
      </Routes>
    </>
  );
}


export default App;
