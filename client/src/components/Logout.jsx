import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetUser } from '../redux-toolkit/userReducer';

export default function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    localStorage.removeItem('token');
    dispatch(resetUser());
    navigate('/login');
  }, [dispatch, navigate]);

  return null;
}
