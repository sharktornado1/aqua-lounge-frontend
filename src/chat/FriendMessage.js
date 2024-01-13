import React from 'react'

function FriendMessage({friendDetails,message}) {
  return (
    <div className='friend-message-container'>
        <img src={friendDetails.pfpUrl? friendDetails.pfpUrl : process.env.PUBLIC_URL + '/myAvatar.png'} className='chat-pfp'></img>
        <p className='friend-message-text'>{message}</p>
    </div>
  )
}

export default FriendMessage