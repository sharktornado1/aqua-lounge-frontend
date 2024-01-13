import axios from 'axios'
import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'


function IncomingFriendBox({user,friendRequests,setFriendRequests}) {

  const [username,setUsername] = useState('Loading username')
  const [userAvatarUrl,setUserAvatarUrl] = useState('')

  const navigate = useNavigate()

  const handleAccept = async () => {
    try{
      const response = await axios.post('/managerequest',{
        friendId: user._id,
        command: 'y'
      })
      if(response.status===200){
        setFriendRequests(friendRequests.filter((request) => request._id !== user._id))
      }
    }catch(e)
    {
      console.log(e)
    }
  }

  const handleDecline = async () => {
    try{
      const response = await axios.post('/managerequest',{
        friendId: user._id,
        command: 'n'
      })
      if(response.status===200){
        setFriendRequests(friendRequests.filter((request) => request._id !== user._id))
      }
    }catch(e)
    {
      console.log(e)
    }
  }

  useEffect(()=>{
    setUsername(user.username)
    setUserAvatarUrl(user.pfpUrl)
  },[])

  return (
    <div className='friend-box'>
        <img src={userAvatarUrl? userAvatarUrl : 'myAvatar.png'} className='friend-box-avatar' onClick={()=>navigate('/profile/'+username)}></img>
        <div className='friend-box-content'>
            <p className='friend-box-username' style={{cursor: 'pointer'}} onClick={()=>navigate('/profile/'+username)}>{username}</p>

            <div className='friend-box-confirm-cancel'>
              <p className='incoming-friend-accept-text' onClick={handleAccept}>Accept</p>
              <p className='incoming-friend-deny-text' onClick={handleDecline}>Decline</p>
            </div>
        </div>
    </div>
  )
}

export default IncomingFriendBox