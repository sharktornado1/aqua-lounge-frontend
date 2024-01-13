import React from 'react'

function UserMessage({userDetails,message}) {
  return (
    <div className='user-message-container'>
        <p className='user-message-text'>{message}</p>
        <img src={userDetails.pfpUrl? userDetails.pfpUrl : process.env.PUBLIC_URL + '/myAvatar.png'} className='chat-pfp'></img>
    </div>
  )
}

export default UserMessage