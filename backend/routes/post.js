const express=require('express');
const { createPost, likeAndUnlikePost, deletePost, getPostOfFollowing, updateCaption,  deleteComment, commentOnPost } = require('../controllers/post');
const { isAuthenticated } = require('../middlewares/auth');

const router = express.Router();


router.route("/post/upload").post(isAuthenticated ,createPost);//isAuthenticated handler is palced before ,so that it si ensured that a user is loged in before going to create a post

router.route("/post/:id")
.delete(isAuthenticated,deletePost)
.put(isAuthenticated,updateCaption);

router.route("/post/:id").get(isAuthenticated,likeAndUnlikePost);

router.route("/posts").get(isAuthenticated,getPostOfFollowing);

router.route("/post/comment/:id")
.put(isAuthenticated,commentOnPost)
.delete(isAuthenticated,deleteComment);


module.exports= router;
