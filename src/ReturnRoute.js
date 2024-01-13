import React, { useState,useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function ReturnRoute(props) {
  
  const navigate = useNavigate()
  const [isLoggedIn,setIsLoggedIn] = useState(false)

  const checkLogin = async () => {
    try {
        const response = await axios.get('/checkjwt');
        if (response.status === 200) {
          setIsLoggedIn(true);
          return navigate('/home')
        } else {
          setIsLoggedIn(false);
        }
        
    } catch (e) {
        console.error(e);
        setIsLoggedIn(false);
        return navigate('/login')
    }
  }
  useEffect(()=> {
    checkLogin()
  },[isLoggedIn])

  return (
    <React.Fragment>
        {
            !isLoggedIn ? props.children : null
        }
    </React.Fragment>
  )
}

export default ReturnRoute