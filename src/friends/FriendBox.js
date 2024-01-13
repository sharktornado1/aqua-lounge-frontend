import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function FriendBox({user,friends,setFriends}) {

  const [isRemoveFriendClicked,setIsRemoveFriendClicked] = useState(false)
  const [username,setUsername] = useState('getting username...')
  const [userAvatarUrl,setUserAvatarUrl] = useState('')

  const navigate = useNavigate()
  
  const handleRemove = async () => {
    try{
      const response = await axios.delete('/friends', {
        params: {
          friendId: user._id
        }
      })
      if(response.status === 200)
      {
        setFriends(friends.filter((i) => i._id !== user._id))
      }
    }catch(e)
    {
      console.log(e)
    }
  }

  useEffect(()=>{
    setUsername(user.username)
    setUserAvatarUrl(user.pfpUrl)
  },[friends])

  return (
    <div className='friend-box'>
        <img src={userAvatarUrl? userAvatarUrl : 'myAvatar.png'} className='friend-box-avatar' onClick={()=>navigate('/profile/'+username)}></img>
        <div className='friend-box-content'>
            <p className='friend-box-username' style={{cursor: 'pointer'}} onClick={()=>navigate('/profile/'+username)}>{username}</p>

            {isRemoveFriendClicked? 
              <div className='friend-box-confirm-cancel'>
                <p className='friend-box-remove-text' onClick={handleRemove}>Confirm</p> 
                <p onClick={()=>setIsRemoveFriendClicked(false)} className='friend-box-cancel-text'>Cancel</p>
              </div>
            : 
              <p className='friend-box-remove-text' onClick={()=>setIsRemoveFriendClicked(true)}>Remove friend</p> }
        </div>
    </div>
  )
}

export default FriendBox