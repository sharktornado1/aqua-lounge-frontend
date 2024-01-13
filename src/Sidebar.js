import React, {useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import io from 'socket.io-client';
import axios from 'axios'
import {
  faHome,
  faUserFriends,
  faComment,
} from '@fortawesome/free-solid-svg-icons';

function Sidebar({userDetails}) {

  const [unreadCount,setUnreadCount] = useState(0)

  const navigate = useNavigate()

  const getUnreads = async () => {
    try{
      const response = await axios.get('/unreads')
      if(response.status === 200){
        setUnreadCount(response.data.unreads.length)
      } 
    }catch(e){
      console.log(e.message)
    }
  }

  useEffect(()=>{
    getUnreads()
  },[])

  useEffect(()=>{
      if(window.location.pathname === '/chat')
      {
        setUnreadCount(0)
      }
      else
      {
        const newSocket = io('http://localhost:5001');

        newSocket.on('connect', () => {
        console.log('Successfully connected to Socket IO server from sidebar');
        });

        newSocket.emit('join', userDetails._id)

        newSocket.on('chat message',(message)=>{
            setUnreadCount((unreadCount) => unreadCount + 1)
        })

        return () => {
            newSocket.disconnect(); // Disconnect from the Socket.IO server when the component unmounts
        };
      }
  },[unreadCount])

  return (
    <div className='sidebar'>
        <div className='sidebar-icon-container' onClick={()=>navigate('/home')}>
            <FontAwesomeIcon icon={faHome} className='sidebar-icon'/>
        </div>
        <div className='sidebar-icon-container' onClick={()=>navigate('/friends')}>
            <FontAwesomeIcon icon={faUserFriends} className='sidebar-icon'/>
        </div>
        <div className='sidebar-icon-container' onClick={()=>navigate('/chat')}>
            {unreadCount===0? <></> : <p className='sidebar-chat-notification'>{unreadCount}</p>}
            <FontAwesomeIcon icon={faComment} className='sidebar-icon'/>
        </div>
    </div>
  )
}

export default Sidebar