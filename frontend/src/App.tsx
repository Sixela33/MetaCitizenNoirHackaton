import { useEffect, useState } from 'react';
import './App.css'
import axiosInstance from './utils/axios';
function App() {
  
  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/auth/google/login';
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      localStorage.setItem('jwtToken', token);
      window.location.href = '/';
      setIsLoggedIn(true);
    }

  }, []);

  async function getUserProfile() {
    const res = await axiosInstance.get('/auth/profile');
    console.log(res.data);
    setUser(res.data);
  }

  useEffect(() => {
    getUserProfile();
  }, [isLoggedIn]);

  return (
    <>
      <button onClick={handleGoogleLogin}>Login with Google</button>
      {user && <div>{user.email}</div>}
    </>
  )
}

export default App
