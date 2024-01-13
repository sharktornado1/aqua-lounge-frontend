import React, { useEffect, useState} from 'react'
import Post from '../posts/Post'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil} from '@fortawesome/free-solid-svg-icons';

function ProfileMain({userDetails,key1,setKey}) {

  let {username} = useParams()
  const [posts, setPosts] = useState([])
  const [editPfp,setEditPfp] = useState(false)
  const [profileImage,setProfileImage] = useState(null)
  const [isUploading,setIsUploading] = useState(false)
  const [isFriends,setIsFriends] = useState(false)
  const [profileId,setProfileId] = useState('')
  const [sentRequest,setSentRequest] = useState(false)

  const navigate = useNavigate()
 
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
  }

  const fetchPosts = async () => {
    try{
      const response = await axios.get('/userposts', {
        params: {
          username
        }
      })
      if(response.status === 200)
      {
        setPosts(response.data.reverse())
      }
    }catch(e)
    {
      console.log(e)
    }
  }
  
  const fetchProfile = async () => {
    try{
      const response = await axios.get('/profiledetails', {
        params: {
          username
        }
      })
      if(response.status === 200)
      {
        setProfileImage(response.data.pfpUrl)
        setProfileId(response.data._id)
        if(response.data.friends.find(obj => obj.userId === userDetails._id))
        {
          setIsFriends(true)
        }
      }
    }catch(e)
    {
      if(e.response.data === 'User not found')
      {
        navigate('/home')
      }
    }
  }

  const handlePfpUpdate = async (e) => {
    setIsUploading(true)
    e.preventDefault()
    const formData = new FormData()
    formData.append('image', profileImage);
    try{
      const response = await axios.patch('/profilepic',formData,{
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
      if(response.status === 200)
      {
        setIsUploading(false)
        setEditPfp(false)
        setKey(key1+1)
      }
    }catch(e)
    {
      console.log(e)
    }
  }
  const handleRemove = async () => {
    try{
      const response = await axios.delete('/friends', {
        params: {
          friendId: profileId
        }
      })
      if(response.status === 200)
      {
        setIsFriends(false)
      }
    }catch(e)
    {
      console.log(e)
    }
  }
  const handleSend = async () => {
    try{
      const response = await axios.post('/friendrequest',{
        friendId: profileId
      })
      if(response.status === 200)
      {
        setSentRequest(true)
      }
    }catch(e)
    {
      alert(e.response.data)
    }
  }

  useEffect(()=>{
    fetchProfile()
    fetchPosts()
  },[username])

  return (
    <div className='main-content'>
      <div className='profile-post-page-container'>
        <div className='profile-header'>
          <div className='profile-pic-container'>
            <img src={profileImage? profileImage : process.env.PUBLIC_URL + '/myAvatar.png'} className='profile-pic'></img>
            {
            userDetails.username === username?
            
            !isUploading? 
            
            !editPfp ? <p className='profile-edit-pic-text' onClick={()=>setEditPfp(true)}>Edit Profile Picture <FontAwesomeIcon icon={faPencil}/></p>: 
              <form className='profile-edit-pic-form' onSubmit={handlePfpUpdate}>
                <input type='file' accept='image/*' id='userpfp' className='profile-pic-input' required onChange={handleImageChange}></input>
                <button className='profile-edit-pic-button' type='submit'>Submit</button>
                <button className='profile-edit-pic-button' onClick={()=>setEditPfp(false)}>Cancel</button>
              </form>
              
              : <p>Uploading</p>
              : <></>
            }
          </div>
          <div className='profile-details-container'>
            <p className='profile-title'>{username}'s Profile</p>
            {userDetails.username === username?  <></> :
              <>
                {isFriends ? <p>You are friends with this user</p> : sentRequest? <p>Friend request sent</p>:<p>You are not friends with this user</p>}
                {isFriends ? 
                <button className='profile-friends-button-remove' onClick={handleRemove}>Remove Friend</button> : 
                <button className='profile-friends-button-add' onClick={handleSend}>Send friend request</button>}
              </>
            } 
          </div>
        </div>
        <div>
          {posts.map((post, index) => (
            <Post key={index} post={post} fetchPosts={fetchPosts} posts={posts} userDetails={userDetails}></Post>
          ))}
        </div>
          
      </div>
    </div>
  )
}

export default ProfileMain