import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import HomePage from './posts/HomePage';
import Signup from './Signup';
import ProtectedRoute from './ProtectedRoute';
import ReturnRoute from './ReturnRoute';
import FriendsPage from './friends/FriendsPage';
import ProfilePage from './profile/ProfilePage';
import axios from 'axios';
import ChatPage from './chat/ChatPage';
import { SocketProvider,  useSocket } from './SocketContext';

function App() {

  const [userDetails, setUserDetails] = useState({})
  const [retrievingDetails,setRetrievingDetails] = useState(true)
  const [key1, setKey] = useState(0) //This key is used to refresh the userDetails so that the App.js can getUserDetails()
  const [isJoined,setIsJoined] = useState(false)

  const socket = useSocket()

  const getUserDetails = async () => {
    try{
      const response = await axios.get('/userdetails')
      if(response.status===200)
      {
        setUserDetails(response.data)
        if(!isJoined)
        {
          setIsJoined(true)
          socket.emit('join',response.data._id)
        }
      }
    }catch(e)
    {
      console.log(e)
    }finally{
      setRetrievingDetails(false)
    }
    
  }

  useEffect(()=>{
    getUserDetails()
  },[key1])

  if(retrievingDetails)
  {
    return (
      <div>Loading...</div>
    )
  }
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<ReturnRoute> <LoginPage key1={key1} setKey={setKey}/> </ReturnRoute>} />
          <Route path="/signup" element={<ReturnRoute> <Signup key1={key1} setKey={setKey}/> </ReturnRoute>} />
            <Route path="/home" element={<ProtectedRoute>  <HomePage userDetails={userDetails}/>   </ProtectedRoute>}  />
            <Route path="/friends" element={<ProtectedRoute>  <FriendsPage userDetails={userDetails}/>   </ProtectedRoute>}  />
            <Route path="/profile/:username" element={<ProtectedRoute> <ProfilePage userDetails={userDetails} key1={key1} setKey={setKey}/> </ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute>  <ChatPage userDetails={userDetails} /> </ProtectedRoute>}  />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
