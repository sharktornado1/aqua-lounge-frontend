import React, { useState,useEffect,useRef } from 'react'
import axios from 'axios';
import UserMessage from './UserMessage'
import FriendMessage from './FriendMessage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPaperPlane} from '@fortawesome/free-solid-svg-icons';
import ChatFriend from './ChatFriend';
import io from 'socket.io-client';

function ChatMain({userDetails}) {

    const [friends,setFriends] = useState([])
    const [filteredFriends,setFilteredFriends] = useState([])
    const [selectedFriend,setSelectedFriend] = useState({})
    const [messages,setMessages] = useState([])
    const [message,setMessage] = useState('')
    const [isLoading,setIsLoading] = useState(false)
    const [socket,setSocket] = useState(null)
    const [unreads,setUnreads] = useState([])
    const messageRef = useRef(null)

    const handleFilter = (e) => {
        e.preventDefault()
        setFilteredFriends(friends.filter((friend) => friend.username.includes(e.target.value)))
    };
    
    const getFriends = async () => {
        try {
          const response = await axios.get('/getfriends')
          if(response.status===200)
          {
            setFriends(response.data)
          }
        }catch(e)
        {
          console.log(e)
        }
    }
    const handleGetMessages = async () => {
        try{
            setIsLoading(true)
            const response = await axios.get('/messages', {
                params: {
                  friendId: selectedFriend._id
                }
            })
            if(response.status === 200){
                if(response.data){
                    setMessages(response.data.messages)
                    
                }else{
                    setMessages([])
                }
                setIsLoading(false)
            }
        }catch(e)
        {
            console.log(e)
        }
    }

    const handleSend = async (e) =>{
        e.preventDefault()
        if(socket && selectedFriend._id)
        {
            try{
                const response = await axios.post('/messages',{
                    friendId: selectedFriend._id,
                    message
                })
                if(response.status === 200)
                {
                    socket.emit('chat message', {
                        message,
                        senderId: userDetails._id,
                        toUserId: selectedFriend._id
                    })
                    const msgObj = {
                        sender: userDetails._id,
                        message
                    }
                    setMessages([...messages,msgObj])
                    setMessage('')
                }
            }catch(e)
            {
                console.log(e)
            }  
        }
        
    }

    const getUnreads = async () => {
        try{
            const response = await axios.get('/unreads')
            if(response.status === 200){
              setUnreads(response.data.unreads)
            } 
          }catch(e){
            console.log(e.message)
          }
    }

    useEffect(()=>{
        const newSocket = io('/');
    
        newSocket.on('connect', () => {
        console.log('Successfully connected to Socket IO server');
        });

        newSocket.emit('join', userDetails._id)

        setSocket(newSocket);

        newSocket.on('chat message',async ({message,senderId})=>{
            getUnreads()
            if(senderId !== selectedFriend._id)
            {
                return
            }
        
            setMessages(prevMessages => [
                ...prevMessages,
                {
                  sender: selectedFriend._id,
                  message
                }
            ])
            

            if(selectedFriend._id){
                
                const response = await axios.patch('/unreads',{
                    friendId: selectedFriend._id
                })
                if(response.status === 200)
                { 
                    setUnreads(unreads.filter((i) => i.userId !== selectedFriend._id))
                }
            }
        })
        return () => {
            newSocket.disconnect(); // Disconnect from the Socket.IO server when the component unmounts
        };
    },[selectedFriend._id])

    useEffect(() => {
        // Scroll to the bottom whenever messages are updated
        if (messageRef.current) {
          messageRef.current.scrollTop = messageRef.current.scrollHeight;
        }
      }, [messages]);

    useEffect(()=>{
        handleGetMessages()
    },[selectedFriend])

    useEffect(()=>{
        setFilteredFriends(friends)
      },[friends])

    useEffect(()=>{
        getFriends()
        getUnreads()
    },[])

  return (
    <div className='main-content'>
        <div className='chat-page-container'>
            <div className='chat-container'>
                <div className='chat-header'>
                    {selectedFriend._id? <p className='chat-header-text'>Chatting with: {selectedFriend.username}</p> : <p className='chat-header-text'>Please select a friend to chat with</p>}
                </div>
                <div className='chat-area-container' ref={messageRef}>
                    
                    {selectedFriend._id? messages.map((msg,index)=>(
                        msg.sender === userDetails._id ? <UserMessage userDetails={userDetails} message={msg.message} key={index}/> :
                        <FriendMessage friendDetails={selectedFriend} message={msg.message} key={index}/>
                    )): <></>}
                </div>
                {selectedFriend._id && !isLoading?
                    <form className='chat-input-container' onSubmit={handleSend}>
                        <input className='chat-input' placeholder='Enter message...' required
                            onChange={(e)=>setMessage(e.target.value)} value={message}></input>
                        <button className='chat-send-button'>
                            <FontAwesomeIcon icon={faPaperPlane} style={{color: 'white', fontSize: '25px'}} type='submit'/>
                        </button>
                    </form> 
                : <></>}
                
            </div>
            <div className='chat-sidebar'>
                <div className='chat-search-form'>
                    <input className='chat-search-input' placeholder='Search Friends...' onChange={handleFilter}></input>
                </div>
                <div className='chat-friends-list-container'>
                    {filteredFriends.map((user,index) => <ChatFriend user={user} key={index} setSelectedFriend={setSelectedFriend} unreads={unreads} getUnreads={getUnreads} friends={filteredFriends}/>)}
                </div>
            </div>
        </div>
    </div>
  )
}

export default ChatMain