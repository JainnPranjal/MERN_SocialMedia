const Post =require("../models/Post");
const User=require("../models/User");
const cloudinary =require("cloudinary");
const mongoose = require('mongoose');

exports.createPost = async (req,res)=>{

    try {

       const myCloud =await cloudinary.v2.uploader.upload(req.body.image ,{
        folder: "posts",
       });//body.image coz we sending it in image named obj fom frontend..
       
       const newPostData ={
            caption:req.body.caption,
            image:{
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            },
            owner:req.user._id //user who will be logged in ,his/her id will be fetched into this owner id
        }

        const newPost=await Post.create(newPostData);
  
        const user =await User.findById(req.user._id);//finding user User model n pushing newPost's id into its(user) post arr
        user.posts.unshift(newPost._id);
        
        await user.save();

        res.status(201).json({
            success:true,
            message :"Post Created",
        })
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
};

exports.deletePost =async(req,res)=>{
    
    console.log("deleted callled");

    try {

        const post =await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({
                success:false,
                message:"post not found",
            });
        }

        if( post.owner.toString() !==req.user._id.toString()){

            return res.status(401).json({
                success:false,
                message:"Unauthorized User",
            });
        }

        
        await cloudinary.v2.uploader.destroy(post.image.public_id);
        const delpost =await Post.findByIdAndDelete(req.params.id);
        // await post.remove();
//to remove post ,also remove post id from user's post array ,by finding user and post index in that user's post arr
        const user =await User.findById(req.user._id);

        const index =user.posts.indexOf(req.params.id);
        user.posts.splice(index,1);

        await user.save();

        res.status(200).json({
            success:true,
            message:"Post deleted",
        });
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};


exports.likeAndUnlikePost =async (req,res)=>{

    console.log("like unlike called");
    try {

        const post =await Post.findById(req.params.id);


        if(!post){
            return res.status(404).json({
                success:false,
                message:"Post not found",
            });
        }

        //if post was already liked; -unlike post
        if(post.likes.includes(req.user._id)){
            const index = post.likes.indexOf(req.user._id);

            post.likes.splice(index ,1);
            await post.save();

            return res.status(200).json({
                success :true,
                message :"Post Unliked",
            });
        }
        else{//if post was not liked

            post.likes.push(req.user._id);

            await post.save();

            return res.status(200).json({
                success:true,
                message:"Post Liked",
            });
        
        }

        
    } catch (error) {
        res.status(500).json({
            success:false,
            message: error.message,
        });
    }
    
};


exports.getPostOfFollowing =async (req,res)=>{

    try {
        const user=await User.findById(req.user._id);

        const posts =await Post.find({
            owner :{
                $in: user.following,
            },
        }).populate("owner likes comments.user");

        res.status(200).json({
            success: true,
            posts:posts.reverse(),
        });

    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};

exports.updateCaption =async (req,res)=>{

    try {
      //console.log("Received Post ID:", req.params.id);

      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Post ID",
        });
      }

        const post = await Post.findById(req.params.id);
    
        if (!post) {
          return res.status(404).json({
            success: false,
            message: "Post not found",
          });
        }
    
        if (post.owner.toString() !== req.user._id.toString()) {
          return res.status(401).json({
            success: false,
            message: "Unauthorized User",
          });
        }
    
        post.caption = req.body.caption;
        await post.save();
        
        res.status(200).json({
          success: true,
          message: "Post updated",
        });
        
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
};

exports.commentOnPost =async (req,res) => {
    try {

        const post=await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({
                success: false,
                message: "Post not found",
              });
        }

        let commentIndex =-1

        post.comments.forEach((item,index) => {
           if(item.user.toString() === req.user._id.toString()){
            commentIndex =index;
           } 
        });

        if(commentIndex !=-1){
            
            post.comments[commentIndex].comment = req.body.comment;
           
            await post.save();

            return res.status(200).json({
                success:true,
                message:"comment Updated",
            });
        }
        else{

            post.comments.push({
                user : req.user._id,
                comment:req.body.comment,
            });
            await post.save();

            res.status(200).json({
                success:true,
                message:"comment added",
            });
        }       
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
          });
    }
  };

  exports.deleteComment = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
  
      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }
  
      // Checking If owner wants to delete
  
      if (post.owner.toString() === req.user._id.toString()) {
        if (req.body.commentId === undefined) {//commentId req in body
          return res.status(400).json({
            success: false,
            message: "Comment Id is required",
          });
        }
  
        post.comments.forEach((item, index) => {
          if (item._id.toString() === req.body.commentId.toString()) {
            return post.comments.splice(index, 1);
          }
        });
  
        await post.save();
  
        return res.status(200).json({
          success: true,
          message: "Selected Comment has deleted",
        });
      } else {//commented on someone else post
        post.comments.forEach((item, index) => {
          if (item.user.toString() === req.user._id.toString()) {
            return post.comments.splice(index, 1);
          }
        });
  
        await post.save();
  
        return res.status(200).json({
          success: true,
          message: "Your Comment has deleted",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };