import React, { useEffect } from 'react'
import Main from './Main'
import Sidebar from '../Sidebar'
import Header from '../Header'



function HomePage({userDetails}) {


  return (
    <div className='grid-container'>
      <Header userDetails={userDetails}/>
      <Sidebar userDetails={userDetails}/>
      <Main userDetails={userDetails}/>
    </div>
  )
}

export default HomePage