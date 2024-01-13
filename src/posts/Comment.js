import React from 'react'
import { useNavigate } from 'react-router-dom'

function Comment({comment}) {
  const commentUsername = comment.username
  const commentContent = comment.content

  const navigate = useNavigate()

  return (
    <div className='comment-container'>
        <p className='comment-username' onClick={()=>navigate('/profile/'+commentUsername)}>{commentUsername}: </p>
        <p className='comment-text'>{commentContent}</p>
    </div>
  )
}

export default Comment