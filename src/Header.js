import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Header({userDetails}) {
  const navigate = useNavigate()
  const handleLogout = async () => {
    try{
      const response = await axios.post('/logout')
      if(response.status === 200)
      {
        
        navigate('/login')
      }
    }catch(e)
    {
      console.log(e)
    }
  }

  return (
    <div className='header'>
      
      <img src={userDetails.pfpUrl? userDetails.pfpUrl : process.env.PUBLIC_URL + '/myAvatar.png'} className='header-profile-pic' onClick={()=>navigate('/profile/'+userDetails.username)} alt='headerpfp'></img>
      <p onClick={handleLogout} className='logout-text'>Logout</p>
      <p className='header-credit-text'>Web-App developed and maintained by: Karteke Rawal</p>
    </div>
  )
}

export default Header