import { Avatar, Typography ,Dialog } from '@mui/material'
import React, {  useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Post.css';
import  {MoreVert,Favorite,FavoriteBorder,ChatBubbleOutline,DeleteOutline} from '@mui/icons-material'
import {Button} from '@mui/material'
import { useDispatch, useSelector} from 'react-redux';
import { addCommentOnPost, deletePost, likePost, updatePost } from '../../Actions/Post';
import { getFollowingPosts, getMyPosts, loadUser } from '../../Actions/User';
import User from '../User/User';
import { Button as MuiButton } from '@mui/material';
import CommentCard from '../CommentCard/CommentCard';

const Post = ({
    postId,
    caption,
    postImage,
    likes =[],
    comments =[],
    ownerImage,
    ownerName,
    ownerId,
    isDelete =false,
    isAccount =false,
}) => {

    const [liked,setLiked] = useState(false);
    const [likesUser,setLikesUser] =useState(false);
    const [commentValue ,setCommentValue] =useState("");
    const [commentToggle ,setCommentToggle] =useState(false);

    const [captionValue ,setCaptionValue] =useState(caption);
    const [captionToggle ,setCaptionToggle] =useState(false);


    const {user} =useSelector(state => state.user);
    
    const dispatch = useDispatch();
    
    const handleLike= async()=>{
        setLiked(!liked);
        
        await dispatch(likePost(postId));
        
        if(isAccount){//when we are in our accounts section,i.e, looking for our own posts,we wont dispatch getFollowingPosts
            dispatch(getMyPosts());
        }
        else{
            dispatch(getFollowingPosts());

        }
    };

    const addCommentHandler = async (e) => {
        //console.log(' add comment');
        e.preventDefault();
        await dispatch(addCommentOnPost(postId, commentValue));
    
        if (isAccount) {//when we are in our accounts section,i.e, looking for our own posts,we wont dispatch getFollowingPosts
          dispatch(getMyPosts());
        } else {
          dispatch(getFollowingPosts());
        }
      };

    const updateCaptionHandler =async(e)=>{

        e.preventDefault();
        await dispatch(updatePost(postId ,captionValue));
        setCaptionToggle(false);
         
        dispatch(getMyPosts());
    };

    const deletePostHandler =async( )=>{
        await dispatch(deletePost(postId)); 
        dispatch(getMyPosts());
        dispatch(loadUser());
    };

    useEffect(()=>{
        if (user && user._id) {
            const isLiked = likes.some((item) => item && item._id === user._id);
            setLiked(isLiked);
        }
    },[likes ,user._id ,user]);

    
  return (
    <div className='post'>
        <div className="postHeader">
            {isAccount ? (
                <Button  onClick={() => setCaptionToggle(!captionToggle)}>
                    <MoreVert />
                </Button>
            ) :null}
        </div>

        <img src={postImage} alt="Post" />

        <div className="postDetails">
            <Avatar 
              src={ownerImage}
              alt="user"
              sx={{
                height: "3vmax",
                width : "3vmax",
              }}
            />

            <Link to={`/user/${ownerId}`}>
                <Typography fontWeight={700}> {ownerName}</Typography>
            </Link>  

            <Typography
            fontWeight={100}
            color="rgba(0,0,0,0.582)"
            style={{alignSelf:"center"}}
            >
              {caption}
            </Typography>

            
        </div>

        <button 
          onClick={() => setLikesUser(!likesUser)}
          disabled={likes.length === 0 ?true :false}
          style={{
            border:"none",
            backgroundColor:"white",
            cursor:"pointer",
            margin:"1vmax 2vmax"
          }}> 
            <Typography>
                {likes.length} Likes
            </Typography>
        </button>

        <div className="postFooter">

            <Button onClick={handleLike}>
                {liked ? <Favorite style={{ color: "red"}} /> :<FavoriteBorder/>}
            </Button>

            <MuiButton onClick={() => setCommentToggle(!commentToggle)}>
                <ChatBubbleOutline/>
            </MuiButton>

            {  isDelete ? (
                    <Button onClick={deletePostHandler}>
                     <DeleteOutline/>
                    </Button>
                ): null
            }
        </div>

        <Dialog open={likesUser} onClose={() => setLikesUser(!likesUser)}>
            <div className="DialogBox">
                <Typography variant="h4">
                    Liked By :
                    {likes.length > 0 ? likes.map((like) => like ? (
                            <User
                                key={like._id}
                                likeId={like._id}
                                name={like.name}
                                avatar={like.avatar.url}
                            />
                        ) : null) : <Typography>No Likes</Typography>}
                </Typography>
            </div>
        </Dialog>

        <Dialog open={commentToggle} 
                onClose={() => setCommentToggle(!commentToggle)}>
            <div className="DialogBox">
                <Typography variant="h4">
                    Comments
                </Typography>

                    <form className='commentForm' onSubmit={addCommentHandler}>
                        <input 
                        type="text" 
                        value={commentValue}
                        onChange={(e)=> setCommentValue(e.target.value)}
                        placeholder="Comment Here "
                        required
                        />    
                        <Button type='submit ' variant='contained'>
                        Add
                       </Button>                    
                    </form> 

                    {comments.length > 0 ? (
                        comments.map((item) => item.user ? (
                            <CommentCard
                                key={item._id}
                                userId={item.user._id}
                                name={item.user.name}
                                avatar={item.user.avatar.url}
                                comment={item.comment}
                                commentId={item._id}
                                isAccount={isAccount}
                                postId={postId}
                            />
                        ) : null)
                    ) : (
                        <Typography>No Comments</Typography>
                    )}
                                        
            </div>
        </Dialog>

        <Dialog open={captionToggle} 
                onClose={() => setCaptionToggle(!captionToggle)}>
            <div className="DialogBox">
                <Typography variant="h4">
                    Update Caption
                </Typography>

                    <form className='commentForm' onSubmit={updateCaptionHandler}>
                        <input 
                        type="text" 
                        value={captionValue}
                        onChange={(e)=> setCaptionValue(e.target.value)}
                        placeholder="change caption Here "
                        required
                        />    
                        <Button type='submit ' variant='contained'>
                        Update
                       </Button>                    
                    </form> 
                                   
            </div>
        </Dialog>
    </div>
  )
}

export default Post