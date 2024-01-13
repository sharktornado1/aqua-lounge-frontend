import React,{ useState} from 'react'
import axios from 'axios'
import {Link,useNavigate} from 'react-router-dom'
import './login.css'

function LoginPage({key1,setKey}) {

  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    try{
        e.preventDefault()
        const data = {username,password}
        const response = await axios.post('/login', data);
        if(response.status===200)
        {
          setKey(key1+1)
          navigate('/home')
        }
    }catch(error){
        alert(error.response.data)
        console.log(error.response.data)
    }
  }

  return (
    <div className='login-page-container'>
      <h1 className='login-page-title'>
        Aqua Lounge
      </h1>
      <form className='login-form' onSubmit={handleSubmit}>
        <img src={process.env.PUBLIC_URL + '/logo.png'} className='login-page-logo'></img>
        <h1 style={{marginTop: '0px'}}>LOGIN</h1>
        <input type='text' placeholder='Enter Username' className='login-form-input' onChange={(e)=>setUsername(e.target.value)}></input>
        <input type='password' placeholder='Enter password' className='login-form-input' onChange={(e)=>setPassword(e.target.value)}></input>
        <button className='login-form-button'>Login</button>
        <p>Don't have an account? <Link to='/signup'>Click here</Link> to register</p>
      </form>
    </div>
  )
}

export default LoginPage