import React, { useState, useEffect } from "react";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import FeedWithHeaderLayout from "../../styles/FeedWithHeaderLayout";
import goodformImage from "../Feed/goodForm.png"
import likeImage from "../Feed/Love icon.png"
import badformImage from "../Feed/badForm.png"
import removeImage from "../Feed/remove icon.png"
import strongImage from "../Feed/Strong.jpg"
import goodWeightImage from "../Feed/Strong weight.png"
import Swal from "sweetalert2";

export default function Feed(){

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

    const [publicPost, setPublicPost] = useState("public")

    const setPublic = () => {
      setPublicPost("public")
    }

    const setFriends = () => {
      setPublicPost("private")
    }

    const setOwn = () => {
      setPublicPost("own")
    }

    const [postDetails, setPostDetails] = useState([])

    const [friendsPostDetails, setFriendsPostDetails] = useState([])

    const showAllPostsURL = `/userapi/api/post/showall`

    useEffect(() => {
  
      const getAllPosts = () => {

        client.get(showAllPostsURL, {headers : headers}).then((response) => {
      
         if (response.status === 200) {
           if (response.data !== null && response.data !== undefined) {
             setPostDetails(response.data);
           } else {
             console.log("No posts available");
           }
         }
       }).catch((error) => {
         console.error("Error fetching:", error);
       });


      }  

      getAllPosts();
      const interval1 = setInterval(getAllPosts, 5000);
      return () => clearInterval(interval1);
      
      }, [])

    const allPostID = postDetails.map(id => id.id)

    const [currentReactions, setCurrentReactions] = useState([])
    
    useEffect(() => {

      async function retrieveReactions() {

        try {

          const promise = allPostID.map(async number => {
            const res = await client.get(`/userapi/api/post/reactions/view/${userID}/${number}`)
            const reaction = res.data.length > 0 ? res.data[0].reactions : null;
            const id = res.data.length > 0 ? res.data[0].id : null;
            return {number, id: id, reactions: reaction}
          })
          const react = await Promise.all(promise)
          setCurrentReactions(react)
        } catch (error) {
          console.log(error)
        }
      }
      retrieveReactions()
      const interval5 = setInterval(retrieveReactions, 1000);
      return () => clearInterval(interval5);
    }, [postDetails])

    console.log(currentReactions)

    const showFriendsPostsURL = `/userapi/api/post/friends/${userID}`

    useEffect(() => {

      const getFriendsPosts = () => {

        client.get(showFriendsPostsURL, {headers : headers}).then((response) => {
      
        if (response.status === 200) {
          if (response.data !== null && response.data !== undefined) {
            setFriendsPostDetails(response.data);
          } else {
            console.log("No friends posts available");
          }
        }
        }).catch((error) => {
        console.error("Error fetching:", error);
        });

      }

      getFriendsPosts();
      const interval2 = setInterval(getFriendsPosts, 5000);
      return () => clearInterval(interval2);
      

    }, [showAllPostsURL])

    const friendsPostID = friendsPostDetails.map(friendId => friendId.id)

    const [friendCurrentReaction, setFriendCurrentReaction] = useState([])

    useEffect(() => {

      async function retrieveFriendReactions() {

        try {

          const promise = friendsPostID.map(async number => {
            const res = await client.get(`/userapi/api/post/reactions/view/${userID}/${number}`)
            const reaction = res.data.length > 0 ? res.data[0].reactions : null;
            const id = res.data.length > 0 ? res.data[0].id : null;
            return {number, id: id, reactions: reaction}
          })
          const react = await Promise.all(promise)
          setFriendCurrentReaction(react)
        } catch (error) {
          console.log(error)
        }
      }
      retrieveFriendReactions()
      const interval6 = setInterval(retrieveFriendReactions, 1000);
      return () => clearInterval(interval6);
    }, [friendsPostDetails])
  
    const [postInfo, setPostInfo] = useState('')

    const [publicChoice, setPublicChoice] = useState(true)

    const handlePublicChoice = (e) => {

      setPublicChoice(e.target.value)

    }

    const [file, setFile] = useState(null)
    const [isFile, setIsFile] = useState(false)
    const [userPosts, setUserPosts] = useState([])

    const handleFileChange = (e) => {

      setFile(e.target.files[0])
      setIsFile(true)

    }

    function handlePostSend(e) {
      e.preventDefault()
      const formData = new FormData();
      formData.append('user', userID);
      formData.append('post_content', postInfo);
      formData.append('is_Public', publicChoice);
      if (isFile) {
        formData.append('uploaded_content', file);
      }
      const newHeader = {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }
    client.post("/userapi/api/post/create", formData, newHeader) 
      .then(function (response) {
    if (response.status === 201) {
        console.log("post created")
        setPostInfo('')
        setPublicChoice(true)
        setFile(null)
        setIsFile(false)
        Swal.fire({
          title: 'Post created',
          icon: 'success'
        });
    } })
    .catch ((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Something went wrong',
          text: 'Please try again'
        })
    })
    }

    const userPostsURL = `/userapi/api/post/show/${userID}`

    useEffect(() => {
    const viewUserPosts = () => {

        client.get(userPostsURL, {headers : headers}).then((response) => {
      
         if (response.status === 200) {
           if (response.data !== null && response.data !== undefined) {
             setUserPosts(response.data);
           } else {
             console.log("No posts available");
           }
         }
       }).catch((error) => {
         console.error("Error fetching:", error);
       });

      }

      viewUserPosts();    
      const interval3 = setInterval(viewUserPosts, 5000);
      return () => clearInterval(interval3);
      
    }, [userPostsURL])


      const [postID, setPostID] = useState('')

      const handlePostID = (postID) => {
        setPostID(postID)
      }

      const [sendComments, setSendComments] = useState('')

      function handleCommentSend(e) {
        e.preventDefault()
        const body = JSON.stringify({
          user: userID,
          post: postID,
          comment: sendComments
      })
      
      client.post("/userapi/api/comment/create", body, {headers : headers}) 
        .then(function (response) {
      if (response.status === 201) {
          console.log("comment sent")
          setSendComments('')
      } })
      
      .catch ((error) => {
          console.log("error sending comment", error)
      })
      }

      const [userComments, setUserComments] = useState([])

      const userCommentURL = `/userapi/api/comment/show/${postID}`

      useEffect(() => {
  
        const showComments = () => {

          client.get(userCommentURL, {headers : headers}).then((response) => {
      
         if (response.status === 200) {
           if (response.data !== null && response.data !== undefined) {
             setUserComments(response.data);
           } else {
             console.log("No comments available");
           }
         }
        }).catch((error) => {
         console.error("Error fetching:", error);
        });

        }

        showComments();
        const interval4 = setInterval(showComments, 3000);
        return () => clearInterval(interval4);
      
      }, [userCommentURL])

      const [whichReaction, setWhichReaction] = useState("like")

      const handleLikeReaction = () => {
        setWhichReaction("like")
      }

      const handleGoodReaction = () => {
        setWhichReaction("good form")
      }

      const handleBadReaction = () => {
        setWhichReaction("bad form")
      }

      const handleStrongReaction = () => {
        setWhichReaction("strong")
      }

      const handleGoodWeightReaction = () => {
        setWhichReaction("good weight")
      }



      const [postLike, setPostLikes] = useState([])
      const [goodForm, setGoodForm] = useState([])
      const [badForm, setBadForm] = useState([])
      const [strong, setStrong] = useState([])
      const [goodWeight, setGoodWeight] = useState([])

      const likeReactionsURL = `/userapi/api/post/reactions/Like/${postID}`

      useEffect(() => {
  
        const showLikes = () => {

          client.get(likeReactionsURL, {headers : headers}).then((response) => {
      
         if (response.status === 200) {
           if (response.data !== null && response.data !== undefined) {
             setPostLikes(response.data);
           } else {
             console.log("No comments available");
           }
         }
        }).catch((error) => {
         console.error("Error fetching:", error);
        });

        }

        showLikes();
        const interval5 = setInterval(showLikes, 3000);
        return () => clearInterval(interval5);
      
      }, [likeReactionsURL])

      const goodFReactionsURL = `/userapi/api/post/reactions/Goodf/${postID}`

      useEffect(() => {
  
        const showGoodF = () => {

          client.get(goodFReactionsURL, {headers : headers}).then((response) => {
      
         if (response.status === 200) {
           if (response.data !== null && response.data !== undefined) {
             setGoodForm(response.data);
           } else {
             console.log("No comments available");
           }
         }
        }).catch((error) => {
         console.error("Error fetching:", error);
        });

        }

        showGoodF();
        const interval6 = setInterval(showGoodF, 3000);
        return () => clearInterval(interval6);
      
      }, [goodFReactionsURL])

      const badFReactionsURL = `/userapi/api/post/reactions/Badf/${postID}`

      useEffect(() => {
  
        const showBadF = () => {

          client.get(badFReactionsURL, {headers : headers}).then((response) => {
      
         if (response.status === 200) {
           if (response.data !== null && response.data !== undefined) {
             setBadForm(response.data);
           } else {
             console.log("No comments available");
           }
         }
        }).catch((error) => {
         console.error("Error fetching:", error);
        });

        }

        showBadF();
        const interval7 = setInterval(showBadF, 3000);
        return () => clearInterval(interval7);
      
      }, [badFReactionsURL])

      const strongURL = `/userapi/api/post/reactions/Strong/${postID}`

      useEffect(() => {
  
        const showStrong = () => {

          client.get(strongURL, {headers : headers}).then((response) => {
      
         if (response.status === 200) {
           if (response.data !== null && response.data !== undefined) {
             setStrong(response.data);
           } else {
             console.log("No comments available");
           }
         }
        }).catch((error) => {
         console.error("Error fetching:", error);
        });

        }

        showStrong();
        const interval7 = setInterval(showStrong, 3000);
        return () => clearInterval(interval7);
      
      }, [strongURL])

      const goodWeightURL = `/userapi/api/post/reactions/GoodW/${postID}`

      useEffect(() => {
  
        const showGoodW = () => {

          client.get(goodWeightURL, {headers : headers}).then((response) => {
      
         if (response.status === 200) {
           if (response.data !== null && response.data !== undefined) {
             setGoodWeight(response.data);
           } else {
             console.log("No comments available");
           }
         }
        }).catch((error) => {
         console.error("Error fetching:", error);
        });

        }

        showGoodW();
        const interval5 = setInterval(showGoodW, 3000);
        return () => clearInterval(interval5);
      
      }, [goodWeightURL])

      //const [friendId, setFriendId] = useState('')

      const handleSendFriendRequest = (id) => {
        //e.preventDefault();
        const body = JSON.stringify({
            friendship_sender: userID,
            friendship_receiver: id,
        })

        client.post("/userapi/api/friend/create", body, {headers : headers}) 
          .then(function (response) {
        if (response.status === 201) {
          Swal.fire({
            position: 'top-right',
            icon: 'success',
            title: 'Friend request sent',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 1200,
            toast: true
          })
        } })

        .catch ((error) => {
          Swal.fire({
            position: 'top-right',
            icon: 'error',
            title: 'Friendship already exists',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 1200,
            toast: true
          })
        })
      };

      const imageorvid = (media) => {

        if (media.includes('.jpg') || media.includes('.png')) {
          return 'image'
        } else if (media.includes('.mp4')) {
          return 'video'
        } else if (media === null) {
          return "Error"
        }
      }

      const whatReaction = (reaction) => {

        if (reaction === "like") {
          return 'like'
        } else if (reaction === "good form") {
          return 'good form'
        } else if (reaction === "bad form") {
          return 'bad form'
        } else if (reaction == "strong") {
          return 'strong'
        } else if (reaction == "good weight") {
          return 'good weight'
        } else if(reaction === "" || reaction === "null" || reaction === null) {
          return 'empty'
        }

      }

      const [selectedPostId, setSelectedPostId] = useState(null)
  
      const handleChosenPostID = (id) => {
        setSelectedPostId(id)
      }

      console.log(selectedPostId)

      const handleChosenLikeIcon = () => {
        const body = JSON.stringify({
          reactions: "like",
      })
      
      const updateReactionURL = `/userapi/api/post/reactions/update/${selectedPostId}`
      
      
      client.put(updateReactionURL, body, {headers : headers}) 
          .then(function (response) {
        if (response.status === 200) {
          Swal.fire({
            position: 'top-right',
            icon: 'success',
            title: 'You liked this post',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 1200,
            toast: true
          })
        } })
      
        .catch (error => {
          Swal.fire({
            position: 'top-right',
            icon: 'error',
            title: 'Please try again',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 1200,
            toast: true
          })
      })
      }

      const handleChosenGoodFormIcon = () => {
        const body = JSON.stringify({
          reactions: "good form",
      })
      
      const updateReactionURL = `/userapi/api/post/reactions/update/${selectedPostId}`
      
      
      client.put(updateReactionURL, body, {headers : headers}) 
          .then(function (response) {
        if (response.status === 200) {
          Swal.fire({
            position: 'top-right',
            icon: 'success',
            title: 'You reacted with good form',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 1200,
            toast: true
          })
        } })
      
        .catch (error => {
          Swal.fire({
            position: 'top-right',
            icon: 'error',
            title: 'Please try again',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 1200,
            toast: true
          })
      })
      }

      const handleChosenBadFormIcon = () => {
        const body = JSON.stringify({
          reactions: "bad form",
      })
      
      const updateReactionURL = `/userapi/api/post/reactions/update/${selectedPostId}`
      
      
      client.put(updateReactionURL, body, {headers : headers}) 
          .then(function (response) {
        if (response.status === 200) {
          Swal.fire({
            position: 'top-right',
            icon: 'success',
            title: 'You reacted with bad form',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 1200,
            toast: true
          })   
        } })
      
        .catch (error => {
          Swal.fire({
            position: 'top-right',
            icon: 'error',
            title: 'Please try again',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 1200,
            toast: true
          })
      })
      }

      const handleChosenStrongIcon = () => {
        const body = JSON.stringify({
          reactions: "strong",
      })
      
      const updateReactionURL = `/userapi/api/post/reactions/update/${selectedPostId}`
      
      client.put(updateReactionURL, body, {headers : headers}) 
          .then(function (response) {
        if (response.status === 200) {
          Swal.fire({
            position: 'top-right',
            icon: 'success',
            title: 'You reacted with strong',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 1200,
            toast: true
          })   
        } })
      
        .catch (error => {
          Swal.fire({
            position: 'top-right',
            icon: 'error',
            title: 'Please try again',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 1200,
            toast: true
          })
      })
      }

      const handleChosenGoodWReactionIcon = () => {
        const body = JSON.stringify({
          reactions: "good weight",
      })
      
      const updateReactionURL = `/userapi/api/post/reactions/update/${selectedPostId}`
      client.put(updateReactionURL, body, {headers : headers}) 
          .then(function (response) {
        if (response.status === 200) {
          Swal.fire({
            position: 'top-right',
            icon: 'success',
            title: 'You reacted with good weight',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 1200,
            toast: true
          })   
        } })
      
        .catch (error => {
          Swal.fire({
            position: 'top-right',
            icon: 'error',
            title: 'Please try again',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 1200,
            toast: true
          })
      })
      }

      const handleRemoveReactionIcon = () => {
        const body = JSON.stringify({
          reactions: "",
      })
      
      const updateReactionURL = `/userapi/api/post/reactions/update/${selectedPostId}`
      client.put(updateReactionURL, body, {headers : headers}) 
          .then(function (response) {
        if (response.status === 200) {
          Swal.fire({
            position: 'top-right',
            icon: 'success',
            title: 'Reaction removed',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 1200,
            toast: true
          })   
        } })
      
        .catch (error => {
          Swal.fire({
            position: 'top-right',
            icon: 'error',
            title: 'Please try again',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 1200,
            toast: true
          })
      })
      }

    const [userFriends, setUserFriends] = useState([])

    const showFriendsURL = `/userapi/api/friend/view/${userID}`

    useEffect(() => {

      const getFriends = () => {

        client.get(showFriendsURL, {headers : headers}).then((response) => {
      
        if (response.status === 200) {
          if (response.data !== null && response.data !== undefined) {
            setUserFriends(response.data);
          } else {
            console.log("No friends");
          }
        }
        }).catch((error) => {
        console.error("Error fetching:", error);
        });

      }

      getFriends();
      const interval2 = setInterval(getFriends, 2000);
      return () => clearInterval(interval2);
      

    }, [showFriendsURL])

      
    
    function dateFormatter(x) {

      const splitDate = x.split('-');
      const day = splitDate[2];
      const month = splitDate[1];
      const year = splitDate[0];
    
      return `${day}-${month}-${year}`
    
    }

    function formatTime(time){
  
      const object = new Date(`2024-01-01T${time}Z`)
      const userLocation = navigator.language;
      const formattedTime = object.toLocaleTimeString(userLocation, { timeZone:'Europe/London', hour: '2-digit', minute:'2-digit'})
      return formattedTime
      
    }

    const handlePostRemove = (id) => {
      //e.preventDefault();
      client.delete(`/userapi/api/post/remove/${id}`, {headers : headers}) 
        .then(function (response) {
      if (response.status === 204) {
        Swal.fire({
          icon: 'success',
          title: 'Post removed',
          showConfirmButton: false,
          position: 'top-right',
          toast: true,
          timer: 1200,
          timerProgressBar: true
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Please try again',
          showConfirmButton: false,
          position: 'top-right',
          toast: true,
          time: 1200,
          timerProgressBar: true
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


    return (

        <FeedWithHeaderLayout>
          <div className="container text-center mt-5">
            <div className="row my-5">
              <div className="col text-center">
                <div className="d-flex flex-column align-items-center">
                <div className="d-grid gap-4 d-md-block mb-3">
                  <button className="btn btn-outline-primary" style={{marginRight: '10px'}} onClick={() => setPublic()}>Public</button>
                  <button className="btn btn-outline-primary" onClick={() => setFriends()}>Friends</button>
                </div>  
                  <button className="btn btn-outline-primary mb-3 px-4" data-bs-toggle="modal" data-bs-target="#sendPostModal">Send new post</button>

                  <div class="modal fade" id="sendPostModal" tabindex="-1" aria-labelledby="sendPostModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h1 class="modal-title fs-5" id="sendPostModalLabel" style={{color: 'black'}}>Send a post</h1>
                          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form action="login-form" onSubmit={handlePostSend}>
                        <div class="modal-body">
                            <div className="send-post-container mb-3">
                              <textarea
                                type="text"
                                required=""
                                className="send-post-input"
                                placeholder="Type something"
                                value={postInfo}
                                onChange={e => setPostInfo(e.target.value)}
                              />
                            </div>
                            <select value={publicChoice} onChange={handlePublicChoice} className="mb-3">
                                <option value={true}>Anyone can view</option>
                                <option value={false}>Only friends can view</option>
                            </select>
                            <p className="fileName">Add image or vid: <input type="file" onChange={handleFileChange}/></p>
                        </div>
                        <div class="modal-footer">
                          <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Post</button>
                        </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  <button className="btn btn-outline-primary px-5 mb-4" onClick={() => setOwn()}>My posts</button> 
                </div>         
              </div> 
            </div>

            <div className="row mx-auto mt-4">
              <div className="col">

            {publicPost === "public" && (
            postDetails.slice().reverse().map((posts, index) => (
              <div key={index}>
                  <div className="card mb-3" style={{width: '500px', margin: 'auto'}}>
                    <div className="cardHeader">
                      <h5 className="cardTitle">{posts.username}</h5>
                      {posts.user !== userID && !friendsID.includes(posts.user) ? <button className="btn btn-outline-secondary btn-sm" style={{marginRight: '10px'}} onClick={() => handleSendFriendRequest(posts.user)}>+ Add Friend</button> : <label></label>}
                    </div>
                    <div className="card-body" style={{borderBottom: '1px solid #d9d9d9'}}>
                      <pre className="card-text" style={{textAlign: 'left'}}>{posts.post_content}</pre>
                      {posts.uploaded_content !== null ? (
                      imageorvid(posts.uploaded_content) === "image" && <img alt="user post" key={index} src={posts.uploaded_content} style={{ maxWidth: '100%', height: 'auto' }}/>) : (<label></label>) }
                      {posts.uploaded_content !== null ? (
                      imageorvid(posts.uploaded_content) === "video" && 
                      <video key={index} controls width="450px" height="auto">
                        <source src={posts.uploaded_content} type="video/mp4"/>
                      </video>) : <label></label> }
                    </div>
                    <div className="cardFooter">
                      <button onClick={() => handlePostID(posts.id)} className="btn btn-outline-info btn-custom ms-5"  data-bs-toggle="modal" data-bs-target="#commentsModal">Comment</button>
                      {currentReactions.map((postNumber, index) => (
                        <div key={index}>
                          {postNumber.number === posts.id ? (whatReaction(postNumber.reactions) === 'like' && <img src={likeImage} className="likeImage" onClick={() => handleChosenPostID(postNumber.id)} data-bs-toggle="modal" data-bs-target="#reactionsModal"/>) : <label></label>}
                          {postNumber.number === posts.id ? (whatReaction(postNumber.reactions) === 'good form' && <img src={goodformImage} className="likeImage" onClick={() => handleChosenPostID(postNumber.id)} data-bs-toggle="modal" data-bs-target="#reactionsModal"/>) : <label></label>}
                          {postNumber.number === posts.id ? (whatReaction(postNumber.reactions) === 'bad form' && <img src={badformImage} className="likeImage" onClick={() => handleChosenPostID(postNumber.id)} data-bs-toggle="modal" data-bs-target="#reactionsModal"/>) : <label></label>}
                          {postNumber.number === posts.id ? (whatReaction(postNumber.reactions) === 'strong' && <img src={strongImage} className="likeImage" onClick={() => handleChosenPostID(postNumber.id)} data-bs-toggle="modal" data-bs-target="#reactionsModal"/>) : <label></label>}
                          {postNumber.number === posts.id ? (whatReaction(postNumber.reactions) === 'good weight' && <img src={goodWeightImage} className="likeImage" onClick={() => handleChosenPostID(postNumber.id)} data-bs-toggle="modal" data-bs-target="#reactionsModal"/>) : <label></label>}
                          {postNumber.number === posts.id ? (whatReaction(postNumber.reactions) === 'empty' && <button onClick={() => handleChosenPostID(postNumber.id)} className="btn btn-outline-info btn-custom ms-5" data-bs-toggle="modal" data-bs-target="#reactionsModal">React</button>) : <label></label>}
                        </div>
                      ))}
                      <small style={{marginLeft: '6rem'}}>{dateFormatter(posts.date)}</small>
                      <small className="ms-2">{formatTime(posts.time)}</small>
                    </div>
                  </div>
              </div>
            )) ) }

            <div className="modal fade" id="reactionsModal" tabIndex="-1" aria-labelledby="reactionsModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-body">
                  <img src={likeImage} className="likeImage" onClick={() => handleChosenLikeIcon()} data-bs-dismiss="modal" alt="like"/>
                  <img src={goodformImage} className="likeImage" onClick={() => handleChosenGoodFormIcon()} data-bs-dismiss="modal"/>
                  <img src={badformImage} className="likeImage" onClick={() => handleChosenBadFormIcon()} data-bs-dismiss="modal"/>
                  <img src={strongImage} className="likeImage" onClick={() => handleChosenStrongIcon()} data-bs-dismiss="modal"/>
                  <img src={goodWeightImage} className="likeImage" onClick={() => handleChosenGoodWReactionIcon()} data-bs-dismiss="modal"/>
                  <img src={removeImage} className="likeImage" onClick={() => handleRemoveReactionIcon()} data-bs-dismiss="modal"/>  
                  </div>
                </div>
              </div>
            </div>
            

            {publicPost === "private" && (
            friendsPostDetails.slice().reverse().map((posts, index) => (
                <div key={index}>
                    <div className="card mb-3" style={{width: '500px', margin: 'auto'}}>
                      <div className="cardHeader">
                        <h5 className="cardTitle">{posts.username}</h5>
                      </div>
                      <div className="card-body" style={{borderBottom: '1px solid #d9d9d9'}}>
                        <pre className="card-text" style={{textAlign: 'left'}}>{posts.post_content}</pre>
                        {posts.uploaded_content !== null ? (
                        imageorvid(posts.uploaded_content) === "image" && <img alt="user post" key={index} src={posts.uploaded_content} style={{ maxWidth: '100%', height: 'auto' }}/>) : (<label></label>) }
                        {posts.uploaded_content !== null ? (
                        imageorvid(posts.uploaded_content) === "video" && 
                        <video key={index} controls width="450px" height="auto">
                          <source src={posts.uploaded_content} type="video/mp4"/>
                        </video>) : <label></label> }
                      </div>
                      <div className="cardFooter">
                        <button onClick={() => handlePostID(posts.id)} className="btn btn-outline-info btn-custom ms-5"  data-bs-toggle="modal" data-bs-target="#commentsModal">Comment</button>
                        {friendCurrentReaction.map((postNumber, index) => (
                        <div key={index}>
                          {postNumber.number === posts.id ? (whatReaction(postNumber.reactions) === 'like' && <img src={likeImage} className="likeImage" onClick={() => handleChosenPostID(postNumber.id)} data-bs-toggle="modal" data-bs-target="#reactionsModal"/>) : <label></label>}
                          {postNumber.number === posts.id ? (whatReaction(postNumber.reactions) === 'good form' && <img src={goodformImage} className="likeImage" onClick={() => handleChosenPostID(postNumber.id)} data-bs-toggle="modal" data-bs-target="#reactionsModal"/>) : <label></label>}
                          {postNumber.number === posts.id ? (whatReaction(postNumber.reactions) === 'bad form' && <img src={badformImage} className="likeImage" onClick={() => handleChosenPostID(postNumber.id)} data-bs-toggle="modal" data-bs-target="#reactionsModal"/>) : <label></label>}
                          {postNumber.number === posts.id ? (whatReaction(postNumber.reactions) === 'strong' && <img src={strongImage} className="likeImage" onClick={() => handleChosenPostID(postNumber.id)} data-bs-toggle="modal" data-bs-target="#reactionsModal"/>) : <label></label>}
                          {postNumber.number === posts.id ? (whatReaction(postNumber.reactions) === 'good weight' && <img src={goodWeightImage} className="likeImage" onClick={() => handleChosenPostID(postNumber.id)} data-bs-toggle="modal" data-bs-target="#reactionsModal"/>) : <label></label>}
                          {postNumber.number === posts.id ? (whatReaction(postNumber.reactions) === 'empty' && <button onClick={() => handleChosenPostID(postNumber.id)} className="btn btn-outline-info btn-custom ms-5" data-bs-toggle="modal" data-bs-target="#reactionsModal">React</button>) : <label></label>}
                        </div>
                        ))}
                        <small style={{marginLeft: '6rem'}}>{dateFormatter(posts.date)}</small>
                        <small className="ms-2">{formatTime(posts.time)}</small>
                      </div>
                    </div>
                </div>
              )) )}  

              {publicPost === "own" && (
                userPosts.slice().reverse().map((posts, index) => (
                  <div key={index}>
                    <div className="card mb-3" style={{width: '500px', margin: 'auto'}}>
                      <div className="cardHeader">
                        <h5 className="cardTitle">{posts.username}</h5>
                        <button className="btn btn-danger btn-sm" style={{marginRight: '10px'}} onClick={() => handlePostRemove(posts.id)}>Remove</button>
                      </div>
                      <div className="card-body" style={{borderBottom: '1px solid #d9d9d9'}}>
                        <pre className="card-text" style={{textAlign: 'left'}}>{posts.post_content}</pre>
                        {posts.uploaded_content !== null ? (
                        imageorvid(posts.uploaded_content) === "image" && <img alt="user post" key={index} src={posts.uploaded_content} style={{ maxWidth: '100%', height: 'auto' }}/>) : (<label></label>) }
                        {posts.uploaded_content !== null ? (
                        imageorvid(posts.uploaded_content) === "video" && 
                        <video key={index} controls width="450px" height="auto">
                          <source src={posts.uploaded_content} type="video/mp4"/>
                        </video>) : <label></label> }
                      </div>
                      <div className="cardFooter">
                        <button onClick={() => handlePostID(posts.id)} className="btn btn-outline-info btn-custom ms-5" data-bs-toggle="modal" data-bs-target="#commentsModal">Comment</button>
                        <button className="btn btn-outline-info btn-custom ms-5" data-bs-toggle="modal" data-bs-target="#viewReactionsModal" onClick={() => handlePostID(posts.id)}>View all reactions</button>
                        <small style={{marginLeft: '3rem'}}>{dateFormatter(posts.date)}</small>
                        <small className="ms-2 me-2">{formatTime(posts.time)}</small>
                      </div>
                    </div>
                  </div>
                ))
              )}

              
            <div className="modal fade" id="commentsModal" tabIndex="-1" aria-labelledby="commentsModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-md modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-body" style={{height: '400px', overflowY: 'auto'}}>
                      {userComments.length === 0 ? <p>Be the first to leave a comment</p> : 
                        userComments.map((comments, index) => (
                          <div key={index}>
                            <div style={{padding: '10px 15px', borderRadius: '20px', border: '1px solid', marginBottom: '10px', display: 'inline-block', backgroundColor: '#e0d8d8', width: '400px'}}>
                              <h3 style={{fontSize: '20px', textAlign: 'left', marginBottom: '5px'}}>{comments.username}</h3>
                              <p style={{textAlign: 'left', fontSize: '14px'}}>{comments.comment}</p>
                              <p style={{textAlign: 'right', fontSize: '12px'}}>{dateFormatter(comments.date)} {formatTime(comments.time)}</p>
                            </div>
                          </div>
                        ))
                      } 
                  </div>
                  <div className="modal-footer">
                    <div className="input-group">
                      <form action="login-form" onSubmit={handleCommentSend} className="input-group">
                          <input
                            type="text"
                            required=""
                            value={sendComments}
                            onChange={e => setSendComments(e.target.value)}
                            className="form-control"
                            placeholder="Add a comment" 
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


            <div className="modal fade" id="viewReactionsModal" tabIndex="-1" aria-labelledby="viewReactionsModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header"> 
                    <h1 className="modal-title fs-5" style={{color: 'black'}}>Reactions:</h1>
                    <img src={likeImage} className="likeImage" onClick={() => handleLikeReaction()}/>
                    <img src={goodformImage} className="likeImage" onClick={() => handleGoodReaction()}/>
                    <img src={badformImage} className="likeImage" onClick={() => handleBadReaction()}/>
                    <img src={strongImage} className="likeImage" onClick={() => handleStrongReaction()}/>
                    <img src={goodWeightImage} className="likeImage" onClick={() => handleGoodWeightReaction()}/>
                    <button className="btn btn-close" data-bs-dismiss="modal"></button>
                  </div>
                  <div className="modal-body">
                      {whichReaction === "like" && 
                      <div>
                        <p style={{textAlign: 'left'}}><h4>Likes: {postLike.length}</h4></p>
                        {postLike.map((reaction, index) => (
                        <div key={index}>
                          <ul className="list-group">
                            <li className="list-group-item">{reaction.username}</li>
                          </ul>
                        </div>
                      ))}
                      </div>
                      }
                      {whichReaction === "good form" && 
                      <div>
                        <p style={{textAlign: 'left'}}><h4>Good form: {goodForm.length}</h4></p>
                        {goodForm.map((reaction, index) => (
                        <div key={index}>
                          <ul className="list-group">
                            <li className="list-group-item">{reaction.username}</li>
                          </ul>
                        </div>
                        ))}
                      </div>
                      }
                      {whichReaction === "bad form" && 
                      <div>
                        <p style={{textAlign: 'left'}}><h4>Bad form: {badForm.length}</h4></p>
                        {badForm.map((reaction, index) => (
                          <div key={index}>
                            <ul className="list-group">
                              <li className="list-group-item">{reaction.username}</li>
                            </ul>
                          </div>
                        ))}
                      </div>
                      }
                      {whichReaction === "strong" && 
                      <div>
                        <p style={{textAlign: 'left'}}><h4>Strong: {strong.length}</h4></p>
                        {strong.map((reaction, index) => (
                          <div key={index}>
                            <ul className="list-group">
                              <li className="list-group-item">{reaction.username}</li>
                            </ul>
                          </div>
                        ))}
                      </div>
                      }
                      {whichReaction === "good weight" && 
                      <div>
                        <p style={{textAlign: 'left'}}><h4>Good weight: {goodWeight.length}</h4></p>
                        {goodWeight.map((reaction, index) => (
                          <div key={index}>
                            <ul className="list-group">
                              <li className="list-group-item">{reaction.username}</li>
                            </ul>
                          </div>
                        ))}
                      </div>
                      }
                  </div>
                </div>
              </div>
            </div>

           
            </div>

                  </div>
            </div>

        </FeedWithHeaderLayout>



    )








}