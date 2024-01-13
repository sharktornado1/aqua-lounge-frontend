import React,{useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'


function AddPost({setShowAddPost,fetchPosts}) {

  const [postImage, setPostImage] = useState(null)
  const [postTitle, setPostTitle] = useState('')
  const [postBody, setPostBody] = useState('')

  const disableAddPost = () => {
    setShowAddPost(false)
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    setShowAddPost(false)
    addPost()
  }
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setPostImage(file);
  }
  const addPost = async () => {
    //const newPost = {title: postTitle, content: postBody, image: postImage}
    const formData = new FormData()
    formData.append('title', postTitle);
    formData.append('content', postBody);
    formData.append('image', postImage);
    try{
      const response = await axios.post('/posts',formData,{
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
      if(response.status === 200)
      {
        fetchPosts()
      }
    }catch(e)
    {
      console.log(e)
    }
    
    
  }
  return (
    <div className='add-post-container'>
        <form className='add-post-form-container' onSubmit={handleSubmit}>
            <FontAwesomeIcon icon={faTimes} className='add-post-close-icon' onClick={disableAddPost}/>
            <input placeholder='Enter Post Title' className='add-post-title-input' required onChange={(e)=>{setPostTitle(e.target.value)}}></input>
            <textarea placeholder='Enter Post Body' className='add-post-body-input' onChange={(e)=>{setPostBody(e.target.value)}}></textarea>
            <p style={{marginLeft:'50px', marginTop:'30px'}}>Upload an image to go along with your post</p>
            <input type='file' accept='image/*' id='postimg' style={{marginLeft:'50px'}} onChange={handleImageChange}></input>
            <button type='submit' className='add-post-submit-button'>Submit</button>
        </form>
    </div>
  )
}

export default AddPost