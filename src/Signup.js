import React,{useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'
import './login.css'

function Signup({key1,setKey}) {
  
  const navigate = useNavigate()
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  const [repassword,setRepassword] = useState('')

  const handleSubmit = async (e) => {
    try{
        e.preventDefault()
        if(password!==repassword)
        {
          alert('Passwords do not match')
          return
        }
        if(password.length < 6)
        {
          alert('Password must be atleast 6 characters')
          return
        }
        const data = {username,password}
        const response = await axios.post('/signup', data);
        if(response.status===200)
        {
            alert('Successfully signed up! Login to continue')
            setKey(key1+1)
            navigate('/login')
        }
        else{
            throw new Error('sign up unsuccessful')
        }
    }catch(error){
        alert(error.response.data)
    }
  }
  return (
    <div className='login-page-container'>
      <h1 className='login-page-title'>Aqua Lounge</h1>
      <form className='login-form' onSubmit={handleSubmit}>
        <h1>SIGN-UP</h1>
        <input type='text' placeholder='Enter Username' className='login-form-input' onChange={(e)=>setUsername(e.target.value)}></input>
        <input type='password' placeholder='Enter password' className='login-form-input' onChange={(e)=>setPassword(e.target.value)}></input>
        <input type='password' placeholder='Re-Enter password' className='login-form-input' onChange={(e)=>setRepassword(e.target.value)}></input>
        <button className='login-form-button' type='submit'>Sign-Up</button>
        <p>Already have an account? <Link to='/login'>Click here</Link> to login</p>
      </form>
    </div>
  )
}

export default Signup