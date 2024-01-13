import React from 'react'
import Sidebar from '../Sidebar'
import Header from '../Header'
import ChatMain from './ChatMain'

function ChatPage({userDetails}) {
  return (
    <div className='grid-container'>
        <Header userDetails={userDetails}/>
        <Sidebar userDetails={userDetails}/>
        <ChatMain userDetails={userDetails}/>
    </div>
  )
}

export default ChatPage