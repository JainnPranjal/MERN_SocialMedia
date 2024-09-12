import React, { useEffect, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteMyProfile, getMyPosts, getUserPosts, getUserProfile, logoutUser } from '../../Actions/User';
import Loader from '../Loader/Loader';
import Post from '../Post/Post';
import { Avatar, Button, Dialog, Typography } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { useAlert } from 'react-alert';
import User from '../User/User';

const UserProfile = () => {

    const dispatch =useDispatch();
    const alert =useAlert();
    const params =useParams();
     
    const {user ,loading: userLoading} =useSelector(state => state.UserProfile);
    const {user: me,} =useSelector(state => state.user);


    const {loading ,error ,posts } =useSelector((state) => state.userPosts);
    const {error :likeError ,loading :deleteLoading ,message} = useSelector ((state) =>state.like);

    const [followersToggle ,setFollowersToggle] = useState(false);
    const [followingToggle ,setFollowingToggle] = useState(false);
    const [following,setFollowing] = useState(false);
    const [myProfile ,setMyProfile] = useState(false);
    

    const followHandler =()=>{

        setFollowing(!following);
    }

    useEffect(() => {
        dispatch(getUserPosts(params.id));
        dispatch(getUserProfile(params.id));

        if(user._id ===params.id){
            setMyProfile(true);
        }
    },[dispatch ,user._id ,params.i]);

    useEffect(() =>{
        if(error){
            alert.error(error);
            dispatch({ type : "clearErrors"});
        }
        if(likeError){
            alert.error(likeError);
            dispatch({ type : "clearErrors"});
        }
        if(message){
            alert.success(message);
            dispatch({ type : "clearMessage"});

        }

    },[alert ,error ,message,likeError , dispatch]);

  return loading === true || userLoading === true  ? (
    <Loader /> 
  ) : (
    <div className='account'>
        <div className="accountleft">
        {
            posts && posts.length >0  ? 
             posts.map((post)=>(
                <Post 
                  key={post._id}   
                  postId={post._id}
                  caption={post.caption}
                  postImage={post.image.url}
                  likes ={post.likes}
                  comments ={post.comments}
                  ownerImage={post.owner.avatar.url}
                  ownerName={post.owner.name}
                  ownerId={post.owner._id}
                  isAccount ={true}
                  isDelete={true}   
              />
            )) : (<Typography variant ="h3"> User has not made any post yet:| </Typography>)
        }
        </div>
        <div className="accountright">
            <Avatar 
               src={user.avatar.url}
               sx={{height : "8vmax", width: "8vmax"}}            
            />

            <Typography variant='h5 '>{user.name}</Typography>

            <div>
                <button onClick={() => setFollowersToggle(!followersToggle)}>
                <Typography>Followers </Typography> 
                </button>
                <Typography>{user.followers.length} </Typography> 
            </div>

            <div>
                <button onClick={() => setFollowingToggle(!followingToggle)}>
                <Typography>Following </Typography> 
                </button>
                <Typography>{user.following.length} </Typography> 
            </div>
            
            <div>
                <Typography>Posts</Typography> 
                <Typography>{user.posts.length} </Typography> 
            </div>

            {
                myProfile ? null :(
                    <Button 
                    onClick={followHandler}
                    style={{background: following ?"red":"blue"}}
                    variant ="contained">{
                       following ? "Unfollow " : "Follow" 
                    }
                    </Button>
                )
            }

{/* pop dailog box for followers of user */}
            <Dialog
               open={followersToggle}
               onClose={() => setFollowersToggle(!followersToggle)}>

            <div className="DialogBox">
                <Typography variant="h4"> Followers </Typography>

                {
                    user && user.followers.length > 0 ? (
                        user.followers.map((follower)=>{
                            <User
                            key={follower._id}
                            userId={follower._id}
                            name={follower.name}
                            avatar={follower.avatar.url}
                          /> 
                        })
                    ) : (<Typography style={{ margin : "2vmax"}}> You have no followers </Typography>)
                }
                    
            </div>
        </Dialog>

    
            <Dialog
               open={followingToggle}
               onClose={() => setFollowingToggle(!followingToggle)}>

            <div className="DialogBox">
                <Typography variant="h4"> Following </Typography>

                {
                    user && user.following.length > 0 ? (
                        user.following.map((follow)=>{
                            <User
                            key={follow._id}
                            userId={follow._id}
                            name={follow.name}
                            avatar={follow.avatar.url}
                          /> 
                        })
                    ) : (<Typography style={{ margin : "2vmax"}}> You are not following anyone yet !! </Typography>)
                }
                    
            </div>
        </Dialog>
            


            

        </div>
    </div>
  );
};

export default UserProfile