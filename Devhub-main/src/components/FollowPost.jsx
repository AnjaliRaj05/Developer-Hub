import React, { useEffect, useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2"
import Spinner from "./Spinner";

let PostList = () => {
  let [localPost, setLocalPost] = useState({
    text: "",
    image: "",
  });

  let navigate=useNavigate();
  let [user,setUser] = useState({});
  let [posts, setPosts] = useState({});
  let [loading,setLoading] = useState(true);
  let [loggedIn,setLoggedIn]=useState(false);
  let [profile,setProfile]=useState({});
  let [arr,Setarr]=useState([]);
 useEffect(() => {
   if (!localStorage.getItem("devroom")) {
     navigate("/users/login");
   }
   setLoggedIn(true);
 }, []);

  function timeDifference(current, previous) {
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
      if (elapsed / 1000 < 30) return "Just now";

      return Math.round(elapsed / 1000) + " seconds ago";
    } else if (elapsed < msPerHour) {
      return Math.round(elapsed / msPerMinute) + " minutes ago";
    } else if (elapsed < msPerDay) {
      return Math.round(elapsed / msPerHour) + " hours ago";
    } else if (elapsed < msPerMonth) {
      return Math.round(elapsed / msPerDay) + " days ago";
    } else if (elapsed < msPerYear) {
      return Math.round(elapsed / msPerMonth) + " months ago";
    } else {
      return Math.round(elapsed / msPerYear) + " years ago";
    }
  }
  let getProfile = async () => {
    let { status, data } = await axios.get("http://localhost:5001/api/profiles/me", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("devroom")}`,
      },
    });
    console.log(data);
    if (status == 200){ 
      console.log(data.profile.following);
     Setarr(data.profile.following);
     console.log(arr);
 }

  };


   let getUser = async () => {
     let { data } = await axios.get("http://localhost:5001/api/users/me", {
       headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${localStorage.getItem("devroom")}`,
       },
     });
     setUser(data.user);
     console.log("Ronak")
     console.log(data.user);
     getProfile();
   };

    let getPosts = async () => {
      let { data } = await axios.get("http://localhost:5001/api/posts/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("devroom")}`,
        },
      });
      let postss=data.posts;
      console.log(profile)
      let postsss=postss.filter((obj)=>{
              if(arr.includes(obj.user._id)) return true;
              return false;
      })
      setPosts(postsss);
      console.log(postsss);
      setLoading(false);
    };


  useEffect(() => {
    if (loggedIn) {
      getUser().then(() => {
        getPosts();
      });
    }
  }, [loggedIn]);
  useEffect(() => {
    if (loggedIn) {
      
        getPosts();
    
    }
  }, [arr]);

  let clickDeletePost = async (postId) => {
    const { data } = await axios.delete(`http://localhost:5001/api/posts/${postId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("devroom")}`,
      },
    });
    let newArr = posts.filter((post)=>{
      if(post._id==postId)return false;
      return true;
    })
   setPosts(newArr);
    Swal.fire("Post deleted successfully", "", "success");
  };

  let clickLikePost = async(postId) => {
    const {data} = await axios.put(`http://localhost:5001/api/posts/like/${postId}`,{},{
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("devroom")}`,
      }
    });
   getPosts();
  };

  

  return (
    <React.Fragment>
      {/* { <pre>{JSON.stringify(posts)}</pre> } */}

      
      <section className="p-3">
        {loading ? (
          <Spinner />
        ) : (
          <React.Fragment>

            {posts.length===0 ?(
              <h1>Your followers dont have any posts or you haven't followed anyone yet</h1>
            ) :
              (<div className="container">
                <div className="row">
                  <div className="col">
                    {posts
                      .slice(0)
                      .reverse()
                      .map((post) => {
                        return (
                          <div className="card my-2" key={post._id}>
                            <div className="card-body bg-light-grey">
                              <div className="row">
                                <div className="col-md-2">
                                  <img
                                    src={post.user.avatar}
                                    alt=""
                                    className="rounded-circle"
                                    width="50"
                                    height="50"
                                  />
                                  <br />
                                  <small>{post.name}</small>
                                </div>
                                <div className="col-md-8">
                                  <div className="row">
                                    <div className="col-md-6">
                                      <img
                                        src={post.image}
                                        alt=""
                                        className="img-fluid d-block m-auto"
                                      />
                                    </div>
                                  </div>
                                  <p style={{ fontWeight: "bold" }}>
                                    {post.text}
                                  </p>
                                  <small>
                                    {timeDifference(
                                      new Date(),
                                      new Date(post.createdAt)
                                    )}
                                  </small>
                                  <br />
                                  {post.likes.includes(user._id) ? (
                                    <button
                                      className="btn btn-like btn-sm me-2"
                                      onClick={clickLikePost.bind(
                                        this,
                                        post._id
                                      )}
                                      style={{ color: "white" }}
                                    >
                                      <i
                                        className="fa fa-thumbs-up me-2"
                                        style={{ color: "white" }}
                                      />{" "}
                                      {post.likes.length}
                                    </button>
                                  ) : (
                                    <button
                                      className="btn btn-primary btn-sm me-2"
                                      onClick={clickLikePost.bind(
                                        this,
                                        post._id
                                      )}
                                    >
                                      <i className="fa fa-thumbs-up me-2" />{" "}
                                      {post.likes.length}
                                    </button>
                                  )}

                                  <Link
                                    to={`/posts/${post._id}`}
                                    className="btn btn-warning btn-sm me-2"
                                  >
                                    <i className="fab fa-facebook-messenger me-2" />{" "}
                                    Discussions {post.comments.length}
                                  </Link>
                                  {post.user._id === user._id ? (
                                    <button
                                      className="btn btn-danger btn-sm"
                                      onClick={clickDeletePost.bind(
                                        this,
                                        post._id
                                      )}
                                    >
                                      <i className="fa fa-times-circle" />
                                    </button>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}
          </React.Fragment>
        )}
      </section>
    </React.Fragment>
  );
};
export default PostList;
