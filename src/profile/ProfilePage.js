import React from 'react'
import Sidebar from '../Sidebar'
import Header from '../Header'
import ProfileMain from './ProfileMain'


function ProfilePage({userDetails,key1,setKey}) {
  return (
    <div className='grid-container'>
      <Header userDetails={userDetails}/>
      <Sidebar userDetails={userDetails}/>
      <ProfileMain userDetails={userDetails} key1={key1} setKey={setKey}/>
    </div>
  )
}

export default ProfilePage