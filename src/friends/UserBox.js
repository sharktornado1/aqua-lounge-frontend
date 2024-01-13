import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'


function UserBox({user}) {

  const [isSendClicked,setIsSendClicked] = useState(false)
  const [username,setUsername] = useState('')
  const [userAvatarUrl,setUserAvatarUrl] = useState('')

  const navigate = useNavigate()

  const handleSend = async () => {
    try{
      const response = await axios.post('/friendrequest',{
        friendId: user._id
      })
      if(response.status === 200)
      {
        setIsSendClicked(true)
      }
    }catch(e)
    {
      alert(e.response.data)
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

            {isSendClicked? <p className='user-box-sent-text'>Friend request sent</p>
            : <p className='user-box-send-text' onClick={handleSend}>Send friend request</p> }
        </div>
    </div>
  )
}

export default UserBox