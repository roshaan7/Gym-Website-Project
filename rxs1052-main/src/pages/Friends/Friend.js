import React, { useState, useEffect, useCallback } from "react";
import FriHeaderLayout from "../../styles/FriWithHeaderLayout";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import ReactModal from "react-modal";
import Swal from "sweetalert2";

export default function Friend() {

    const token = sessionStorage.getItem('authenticateTokens');

    const client = axios.create({
        baseURL: 'http://127.0.0.1:8000'
    });

    if(token) {
        const decodeToken = jwtDecode(token);
        var userID = decodeToken.user_id
        var username = decodeToken.username
  
    }

    const headers = {
        'Content-Type': 'application/json',
    }

const [friendId, setFriendId] = useState('')

function handleSendFriendRequest(e) {
  e.preventDefault();
  const body = JSON.stringify({
      friendship_sender: userID,
      friendship_receiver: friendId,
  })

  client.post("/userapi/api/friend/create", body, {headers : headers}) 
    .then(function (response) {
  if (response.status === 201) {
        setFriendId('')
        Swal.fire({
          title: 'Friend request sent',
          icon: 'success',
          position: 'top-right',
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 1200,
          toast: true
        })
  } })

  .catch ((error) => {
    setFriendId('', error)
    Swal.fire({
      title: 'User does not exist or your already friends',
      icon: 'error',
      position: 'top-right',
      showConfirmButton: false,
      timerProgressBar: true,
      timer: 1200,
      toast: true
    })
  })
};

    const [friendRequests, setFriendRequests] = useState([])

const friendRequestsURL = `/userapi/api/friend/requests/${userID}`

useEffect(() => {

  const getFriendRequests = () => {

    client.get(friendRequestsURL, {headers : headers}).then((response) => {

    if (response.status === 200) {
      if (response.data !== null && response.data !== undefined) {
        setFriendRequests(response.data);
      } else {
        console.log("No friend requests");
      }
    }
    }).catch((error) => {
    console.error("Error fetching:", error);
    });

  }

  getFriendRequests();

  const interval = setInterval(getFriendRequests, 2000);

        // Clean up the interval on component unmount
  return () => clearInterval(interval);
}, [friendRequestsURL])


const handleAcceptFriendRequest = (id) => {
  const body = JSON.stringify({
    status: "accept"
})
  client.put(`/userapi/api/friend/decision/${id}`, body, {headers : headers}) 
    .then(function (response) {
  if (response.status === 200) {
    Swal.fire({
      title: 'Friend request accepted',
      icon: 'success',
      position: 'top-right',
      showConfirmButton: false,
      timerProgressBar: true,
      timer: 1200,
      toast: true
    })
  } else {
    Swal.fire({
      title: 'Please try again',
      icon: 'error',
      position: 'top-right',
      showConfirmButton: false,
      timerProgressBar: true,
      timer: 1200,
      toast: true
    })
    }
  })
};

const [friendList, setFriendList] = useState([])

const friendListURL = `/userapi/api/friend/view/${userID}`

const usersID = userID;

useEffect(() => {
  const getFriendList = () => {

    client.get(friendListURL, {headers : headers}).then((response) => {

    if (response.status === 200) {
      if (response.data !== null && response.data !== undefined) {
        setFriendList(response.data);
      } else {
        console.log("No friend requests");
      }
    }
  }).catch((error) => {
    console.error("Error fetching:", error);
  });

  }

  getFriendList();
  const interval = setInterval(getFriendList, 1000);
  return () => clearInterval(interval);
}, [friendListURL])

const filteredFriendList = friendList.map((friend) => {
    const newArray = {...friend}
    for (const key in newArray) {
        if (newArray[key] === usersID) {
            delete newArray[key];
        }
    }
    return newArray;
})

console.log(filteredFriendList)

const friendsID = filteredFriendList.map((friend) => friend.friendship_sender || friend.friendship_receiver)
console.log(friendsID)

const handleRejectFriend = (id) => {
    //e.preventDefault();
    client.delete(`/userapi/api/friend/remove/${id}`, {headers : headers}) 
        .then(function (response) {
    if (response.status === 204) {
      Swal.fire({
        title: 'Friend request rejected',
        icon: 'success',
        position: 'top-right',
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1200,
        toast: true
      })
    } else {
      Swal.fire({
        title: 'PLease try again',
        icon: 'error',
        position: 'top-right',
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1200,
        toast: true
      })
        }
    })
 };

 const [id, setId] = useState(null)

const handleMessageButton = (senderId, receiverID) => {
    setId(senderId || receiverID);
    setMessageModal(true)
} 

const [messageModal, setMessageModal] = useState(false)
const [message, setMessage] = useState("")

function handleMessageModalClose() {
    setMessageModal(false)
    setMessage('')
}

function handleMessageSend(e) {
  e.preventDefault()
  const body = JSON.stringify({
    message_sender: userID,
    message_receiver: id,
    messages: message
})

client.post("/userapi/api/message/send", body, {headers : headers}) 
  .then(function (response) {
if (response.status === 201) {
    console.log("message sent")
    setMessage('')
} })

.catch ((error) => {
    console.log("error sending message", error)
})
}

const [messages, setMessages] = useState([])

const messagesURL = `/userapi/api/message/view/${userID}/${id}`

useEffect(() => {

  const messages = () => {

  client.get(messagesURL, {headers : headers}).then((response) => {

    if (response.status === 200) {
      if (response.data !== null && response.data !== undefined) {
        setMessages(response.data);
      } else {
        console.log("No messages");
      }
    }
    }).catch((error) => {
    console.error("Error fetching:", error);
    });


  }

  messages();
  const interval2 = setInterval(messages, 1500);
  return () => clearInterval(interval2);

  
}, [messagesURL])

function formatTime(time){
  
  const object = new Date(`2024-01-01T${time}Z`)

  const userLocation = navigator.language;

  const formattedTime = object.toLocaleTimeString(userLocation, { timeZone:'Europe/London', hour: '2-digit', minute:'2-digit'})

  return formattedTime
  
}

function dateFormatter(x) {

  const splitDate = x.split('-');
  const day = splitDate[2];
  const month = splitDate[1];
  const year = splitDate[0];

  return `${day}-${month}-${year}`


}


    return (

        <FriHeaderLayout>
          <div className="container text-center mt-5"> 
            <div className="row mx-auto">
                <div className="col-12 mt-4 mx-auto" style={{border: '2px solid', maxHeight: '300px', overflow: 'auto', width: '750px'}}>
                    <h2>UserID: {userID}</h2>          
                      <h4 className="mt-2 mb-3" style={{textDecoration: 'underline'}}>Friend Requests:</h4>
                      <form action="login-form" onSubmit={handleSendFriendRequest}>
                        <input
                          type="number"
                          placeholder="Enter your friends userID"
                          value={friendId}
                          onChange={e => setFriendId(e.target.value)}
                          className="mb-3"
                        />
                        <button className="btn btn-primary btn-sm mb-1 ms-3" type="submit" >Add friend</button>
                        </form>
                        {friendRequests.map((data, index) => (
                          <div key={index}>
                            <div className="list-group">
                              <div className="list-group-item d-flex justify-content-between align-items-center mb-3 mt-3" style={{width: '250px'}}>
                            <span>{data.username}</span>
                            <div>
                              <button onClick={() => handleAcceptFriendRequest(data.id)} className="btn btn-success btn-sm" style={{marginRight: '5px'}}>Accept</button>
                              <button onClick={() => handleRejectFriend(data.id)} className="btn btn-danger btn-sm">Reject</button>
                            </div>
                          </div>
                          </div>
                        </div>
                        ))}    
                    </div>
                  
                
            
              <div className="col-12 mt-5 mb-auto mx-auto" style={{border: '2px solid', maxHeight: '500px', overflow: 'auto', width: '30%'}}>
                <h4 className="mt-2">Friends:</h4>
                {filteredFriendList.map((friend, index) => (
                    <div key={index}>
                      <div className="list-group">
                        <div className="list-group-item d-flex justify-content-between align-items-start mb-3 mt-3 ms-3" style={{width: '250px'}}>
                        <p>{friend.sender_name !== username}</p>
                        <p>{friend.receiver_name === username ? friend.sender_name : friend.receiver_name} ({friend.receiver_name === username ? friend.friendship_sender : friend.friendship_receiver})</p>
                        <button onClick={() => handleMessageButton(friend.friendship_sender, friend.friendship_receiver)} className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#messageModal">Message</button>
                      </div>
                      </div>
                    </div>
                ))}
                <div className="modal fade" id="messageModal" tabIndex="-1" aria-labelledby="messageModalLabel" aria-hidden="true">
                  <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-body" style={{height: '400px', backgroundColor: 'rgb(226, 225, 223)', overflowY: 'auto'}}>
                        {messages.map((message, index) => (
                              <div key={index}>
                                {message.message_sender === userID ?
                                <div style={{display: 'flex', justifyContent: 'end'}}>
                                  <div style={{padding: '10px 15px', borderRadius: '20px', border: '1px solid', marginBottom: '10px', display: 'inline-block', backgroundColor: 'white'}}>
                                    <p>{message.messages} <span style={{fontSize: '10px', marginLeft: '10px'}}>{dateFormatter(message.date)} {formatTime(message.time)}</span></p>
                                  </div> 
                                </div>
                                 :
                                 <div style={{display: 'flex', justifyContent: 'start'}}>
                                  <div style={{padding: '10px 15px', borderRadius: '20px', border: '1px solid', marginBottom: '10px', display: 'inline-block', backgroundColor: 'white'}}>
                                    <p><span style={{fontSize: '10px', marginLeft: '10px'}}>{dateFormatter(message.date)} {formatTime(message.time)}</span> {message.messages}</p>
                                  </div>
                                 </div>
                                  
                                }
                              </div>
                          ))}
                        </div>
                        <div className="modal-footer" style={{borderTop: '0 none'}}>
                          <div className="input-group">
                            <form action="login-form" onSubmit={handleMessageSend} className="input-group">
                                <input
                                  type="text"
                                  value={message}
                                  onChange={e => setMessage(e.target.value)}
                                  required=""
                                  className="form-control" 
                                />
                                <div >
                                  <button type="submit" className="btn btn-primary ms-4">
                                    Send
                                  </button>
                                </div>
                            </form>
                          </div>
                        </div>
                      
                    </div>
                  </div>
                </div>  
            </div>
            </div>
          </div>   

        </FriHeaderLayout>

    )


}