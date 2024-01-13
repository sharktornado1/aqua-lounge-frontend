import React from 'react'
import FriendsMain from './FriendsMain'
import Sidebar from '../Sidebar'
import Header from '../Header'


function FriendsPage({userDetails}) {
  return (
    <div className='grid-container'>
      <Header userDetails={userDetails}/>
      <Sidebar userDetails={userDetails}/>
      <FriendsMain/>
    </div>
  )
}

export default FriendsPage