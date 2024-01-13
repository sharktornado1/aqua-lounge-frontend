import React, { useState, useEffect } from 'react'
import FriendBox from './FriendBox'
import UserBox from './UserBox'
import IncomingFriendBox from './IncomingFriendBox';
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';


function FriendsMain() {

  const [userSearch,setUserSearch] = useState('')
  const [foundUsers,setFoundUsers] = useState([])
  const [friendRequests,setFriendRequests] = useState([])
  const [friends,setFriends] = useState([])
  const [filteredFriends, setFilteredFriends] = useState([])

  const handleSearch = async (e) => {
    e.preventDefault()
    try{
      const response = await axios.get('/getusers', {
        params: {
          keyword: userSearch
        }
      })
      if(response.status===200)
      {
        setFoundUsers(response.data)
      }
    }catch(e)
    {
      console.log(e)
    }
  }
  const handleFilter = (e) => {
    setFilteredFriends(friends.filter((friend) => friend.username.includes(e.target.value)))
  };
  
  const getRequests = async () => {
    try {
      const response = await axios.get('/friendrequest')
      if(response.status===200)
      {
        setFriendRequests(response.data)
      }
    }catch(e)
    {
      console.log(e)
    }
  }
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
  useEffect(()=>{
    setFilteredFriends(friends)
  },[friends])
  
  useEffect(()=>{
    getFriends() 
  },[friendRequests])

  useEffect(()=>{
    getRequests()
  },[])

  return (
    <div className='main-content'>
      <div className='friends-main-content'>
        <div className='friends-list-container'>
            <p className='friends-list-title'>Your friends: {friends.length}</p>
            <input className='friends-list-search-box' placeholder='Search friends...' onChange={handleFilter}></input>
            <div className='friends-list-inner-container'>
              {filteredFriends.map((user,index)=> (
                <FriendBox key={index} user={user} friends={filteredFriends} setFriends={setFriends}/>
              ))}
            </div>
        </div>
        <div className='friends-list-container'>
            <p className='friends-list-title'>Add a friend!</p>
            <form className='user-box-search-container' onSubmit={handleSearch}>
              <input onChange={(e)=>setUserSearch(e.target.value)} className='friends-list-search-box' placeholder='Search for users' style={{width: '75%'}} required></input>
              <button className='user-box-search-button' type='submit'><FontAwesomeIcon icon={faSearch} style={{color: 'white', fontSize: 'larger'}}/></button>
            </form>
            
            <div className='friends-list-inner-container' >
              {foundUsers.map((user,index)=> (
                <UserBox key={index} user={user}/>
              ))}
            </div>
        </div>
        <div className='friends-list-container'>
            <p className='friends-list-title'>Incoming friend requests: {friendRequests.length}</p>  
            <div className='friends-list-inner-container' style={{marginTop:'auto'}}>
              {friendRequests.map((user,index)=> (
                <IncomingFriendBox key={index} user={user} friendRequests={friendRequests} setFriendRequests={setFriendRequests}/>
              ))}
            </div>
        </div>
      </div>
      
    </div>
  )
}

export default FriendsMain