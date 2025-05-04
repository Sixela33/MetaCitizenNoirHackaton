import { useEffect, useState } from 'react';
import './App.css'
import axiosInstance from './utils/axios';
import KycButton from './_components/KycButton';

function App() {  
  const [user, setUser] = useState<any>(null);

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/auth/google/login';
  }

  async function getUserProfile() {
    const res = await axiosInstance.get('/user/profile');
    console.log("res.data", res.data);
    setUser(res.data);
  }

  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <>
      <button onClick={handleGoogleLogin}>Login with Google</button>
      {user && <div>
        <div>{user.firstName} {user.lastName}</div>
        <div>{user.email}</div>
        <img src={user.avatarUrl} alt="Profile" />
        <KycButton />
        </div>

      }

    </>
  )
}

export default App
