import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Post from './Post'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus} from '@fortawesome/free-solid-svg-icons';
import AddPost from './AddPost';

function Main({userDetails}) {

  const [showAddPost,setShowAddPost] = useState(false)
  const [posts,setPosts] = useState([])
  
  const fetchPosts = async () => {
    const response = await axios.get('/posts')
    setPosts(response.data.reverse())
  }

  useEffect(()=>{
    fetchPosts()   
  },[])

  const enableAddPost = () => {
    setShowAddPost(true)
  }
  
  return (
    <div className='main-content'>
      
      <div className='add-post-button-container'>
        <button className='add-post-button'
          onClick={enableAddPost}>
          <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon> Add a new post!
        </button>
      </div>
      <div className='post-page-container'>
          {posts.map((post, index) => (
            <Post key={index} post={post} fetchPosts={fetchPosts} posts={posts} userDetails={userDetails}></Post>
          ))}
      </div>
      {showAddPost && <AddPost setShowAddPost={setShowAddPost} fetchPosts={fetchPosts}/>}
    </div>
  )
}

export default Main