import React,{useState, useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCircle} from '@fortawesome/free-solid-svg-icons';
import io from 'socket.io-client'
import axios from 'axios';

function ChatFriend({user,setSelectedFriend,unreads,getUnreads,friends}) {

  const [userPfp,setUserPfp] = useState('')
  const [username,setUsername] = useState('')
  const [onlineStatus,setOnlineStatus] = useState(false)
  const [userUnreads,setUserUnreads] = useState(0)

  const handleUnreads = async() => {
    setSelectedFriend(user)
    const response = await axios.patch('/unreads',{
      friendId: user._id
    })
    if(response.status === 200)
    {
      getUnreads()
    }
  }
  useEffect(() => {
    const unreadCount = unreads.reduce((acc, unread) => (
      unread.userId === user._id ? acc + 1 : acc
    ), 0);
    setUserUnreads(unreadCount);
  }, [unreads]);

  useEffect(()=>{
    setUserPfp(user.pfpUrl)
    setUsername(user.username)
  },[friends])

  useEffect(()=>{
    const newsocket = io('/')

    newsocket.emit('isOnline',user._id,(isOnline)=>{
      setOnlineStatus(isOnline)
    })

  },[user._id])
  

  return (
    <div className='chat-friend-box' onClick={handleUnreads}>
      <img src={userPfp? userPfp : process.env.PUBLIC_URL + '/myAvatar.png'} className='chat-friend-pfp'></img>
      <p className='chat-friend-username'>{username}</p>
      {userUnreads === 0? <></> : <p className='friend-chat-notification'>{userUnreads}</p>}
      <FontAwesomeIcon icon={faCircle} className={onlineStatus? 'chat-friend-online-status': 'chat-friend-offline-status'}/>
    </div>
  )
}

export default ChatFriend