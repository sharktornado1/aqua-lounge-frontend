import React, { useState ,useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faPaperPlane} from '@fortawesome/free-solid-svg-icons';
import Comment from './Comment';
import moment from 'moment'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';


function Post({post,fetchPosts,posts,userDetails}) {

  const [comments,setComments] = useState([])
  const [comment,setComment] = useState('')
  const [likes,setLikes] = useState([])
  const [dislikes,setDislikes] = useState([])
  const [isLiked,setIsLiked] = useState(false)
  const [isDisliked,setIsDisliked] = useState(false)
  const [likesString,setLikesString] = useState('getting likes list')
  const [dislikesString,setDislikesString] = useState('')
  const [postOwner, setPostOwner] = useState('Default_User')
  const [postOwnerPfp,setPostOwnerPfp] = useState('')
  const [date,setDate] = useState('')

  const navigate = useNavigate()

  const postTitle = post.title
  const postBody = post.content
  const postImageURL = post.imageURL
  const postLikes = post.likes
  const postDislikes = post.dislikes

  //Initially fetching the comments, and setting the Post's owner
  useEffect(()=>{
    setComments([]);
    setLikes([]); 
    setDislikes([]); 
    setIsLiked(false); 
    setIsDisliked(false); 
    setLikesString('getting likes list'); 
    setDislikesString('');
    setDate(moment(post.date).format('DD MMM yyyy')) 

    fetchComments()

    const getOwner = async () => {
      const response = await axios.get('/getPostOwner', {
        params: {
          postId : post._id
        }
      })
      if(response.status === 200)
      {
        setPostOwner(response.data.username)
        setPostOwnerPfp(response.data.pfpUrl)
      }
    }
    getOwner()

  },[posts])
  
  //#1. COMMENTS HANDLING

  const fetchComments = async () => {
    try{
      const response = await axios.get('/comments', {
        params: {
          postId : post._id
        }
      })
      if(response.status === 200)
      {
        setComments(response.data)
      }
    }catch(e){
      console.log(e)
    }
  }

  const addComment = async (e) => {
    e.preventDefault()
    try{
      const response = await axios.post('/comments',{
        postId : post._id,
        comment
      })
      if(response.status === 200)
      {
        fetchComments()
        setComment('')
      }
    }catch(e){
      console.log(e)
    }
  }
  
  //#2. LIKES AND DISLIKES HANDLING

  //Initially setting the post's likes and dislikes array as well as string
  useEffect(()=>{

    const setInitialLikes = async () => {
      setLikes(postLikes)
      setDislikes(postDislikes)

      setLikesString(postLikes.map(obj => obj.username).join(', '))
      setDislikesString(postDislikes.map(obj => obj.username).join(', '))


      postLikes.forEach(element => {
        if(element.username === userDetails.username) {
          setIsLiked(true)
        }
      })
      postDislikes.forEach(element => {
        if(element.username === userDetails.username)
        {
          setIsDisliked(true)
        }
      })
    }
    setInitialLikes()

  },[posts])

  //Like handling logic

  const handleLike = async () => {
    try{
      if(isLiked)
      {
        const response = await axios.post('/handlelikes',{
          postId : post._id,
          command: 'removeLike'
        })
        if(response.status === 200)
        {
          setIsLiked(false)
          setLikes(likes.filter(element => {
            return element.username !== userDetails.username
          }))
          return
        }
      }

      const response = await axios.post('/handlelikes',{
        postId : post._id,
        command: 'addLike'
      })
      if(response.status === 200)
      {
        if(isDisliked){
          setIsDisliked(false) 
          setDislikes(dislikes.filter(element => {
            return element.username !== userDetails.username
          }))
        }
        setIsLiked(true)
        setLikes([...likes, { username: userDetails.username }])

      }
    }catch(e){
      console.log(e)
    }
  }

  //Dislike handling logics

  const handleDislike = async () => {
    try{
      if(isDisliked)
      {
        const response = await axios.post('/handlelikes',{
          postId : post._id,
          command: 'removeDislike'
        })
        if(response.status === 200)
        {
          setIsDisliked(false)
          setDislikes(dislikes.filter(element => {
            return element.username !== userDetails.username
          }))
          return
        }
      }

      const response = await axios.post('/handlelikes',{
        postId : post._id,
        command: 'addDislike'
      })
      if(response.status === 200)
      {
        if(isLiked){
          setIsLiked(false)
          setLikes(likes.filter(element=>{
            return element.username !== userDetails.username
          }))
        }
        setIsDisliked(true)
        setDislikes([...dislikes, { username: userDetails.username }]);
      }
    }catch(e){
      console.log(e)
    }
  }

  //Use effects to change the likes and dislikes string whenever the arrays change

  useEffect(() => {
    // Update likesString whenever likes state changes
    setLikesString(likes.map(obj => obj.username).join(', '));
  }, [likes]);
  
  useEffect(() => {
    // Update dislikesString whenever dislikes state changes
    setDislikesString(dislikes.map(obj => obj.username).join(', '));
  }, [dislikes]);

  //#3. Delete Logic
  const handleDelete = async () => {
    const response = await axios.delete('/posts',{
      params: {
        postId : post._id
      }
    })
    if(response.status===200)
    {
      fetchPosts()
    }
  }
  

  return (
    <div className='post-container'>
        <div className='post-content-container'>
            <p className='post-date'>{date}</p>
            <h2 style={{marginTop: '10px',width: '95%'}}>{postTitle}</h2>
            <p className='post-body'>{postBody}</p>
            {postImageURL ? <img src={postImageURL} alt='PostIMG' className='post-image'></img> : <p></p>}
        </div>
        <div className='post-details-container'>
          <div className='post-details-user-container'>
            <img src={postOwnerPfp? postOwnerPfp : process.env.PUBLIC_URL + '/myAvatar.png'} alt='Post PFP' className='post-profile-pic' onClick={()=>navigate('/profile/'+postOwner)}></img>
            <p className='post-username' onClick={()=>navigate('/profile/'+postOwner)}>{postOwner}</p>
            {userDetails.username === postOwner ? <p className='post-delete-text' onClick={handleDelete}>Delete Post</p> : ''}
          </div>
          <div className='post-likes-container'>
            <p className='likes-font' title ={likesString}>{likes.length}</p>
            <FontAwesomeIcon icon={faThumbsUp} className={isLiked? 'likes-font-clicked' : 'likes-font'} onClick={handleLike}></FontAwesomeIcon>
            <p className='likes-font' title ={dislikesString}>{dislikes.length}</p>
            <FontAwesomeIcon icon={faThumbsDown} className={isDisliked? 'dislikes-font-clicked' : 'likes-font'} onClick={handleDislike}></FontAwesomeIcon>
          </div>
          <div className='post-comments-container'>
            {comments.map((comment, index) => (
            <Comment key={index} comment={comment}></Comment>
            ))}
          </div>
          <form className='add-comment-container' onSubmit={addComment}>
            <textarea className='comment-box' required value={comment}
              onChange={(e)=>{setComment(e.target.value)}}
            ></textarea>
            <button className='add-comment-button'>
              <FontAwesomeIcon icon={faPaperPlane} className='paper-plane'></FontAwesomeIcon>
            </button>
          </form>
        </div>
    </div>
    
  )
}

export default Post