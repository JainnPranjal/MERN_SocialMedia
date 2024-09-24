const Post = require("../models/Post");
const User=require("../models/User");
const {sendEmail} =require("../middlewares/sendEmail")
const crypto=require("crypto");
const cloudinary = require('cloudinary');

exports.register =async(req,res)=>{

    console.log("register called");

    try {
        const {name,email,password,avatar}=req.body;

        let user =await User.findOne({email});
        if(user){  
            return res
            .status(400)
            .json({
                success:false,
                message:"User already exists",  
            });  
        }

        const myCloud =await cloudinary.v2.uploader.upload(avatar ,{
            folder :'avatars'
        });

        user =await User.create({
            name ,
            email ,password ,
            avatar: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            },
        });
        
        //same as login ;so that user also get login after register,i.e, a token is stored into its cookie for as long as 90 days
        const token= await user.generateToken();

        const options ={
            expires :new Date(Date.now()+90*24*60*60*1000),
            httpOnly:true,
        }

     //set the token in cookies with a configuration
        res.status(201).cookie("token",token,options)
        .json({
            success:true,
            user, 
            token, 
        });
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message: error.message,
        });
    }



};

exports.login =async (req,res)=>{

    console.log("login called");
    try {

        const {email,password} = req.body;

        const user=await User.findOne({email}).select("+password");

        if(!user){
            return  res.status(400)
            .json({
                success:false,
                message:"User does not exists",  
            });  
        }

        const isMatch = await user.matchPassword(password);

        if(!isMatch){
            return  res.status(400)
            .json({
                success:false,
                message:"Incorrect Password",  
            });  
        }

        const token= await user.generateToken();
        console.log("Setting cookie with token:", token);

        const options ={
            expires :new Date(Date.now()+90*24*60*60*1000),
            httpOnly:true,
            secure: false,  // Set this to true only if you are using https
            sameSite: 'lax',
        }

        res.status(200).cookie("token",token,options)
        .json({
            success:true,
            user, 
            token, 
        });

        
    } catch (error) {
        res.status(500).json({
            success:false,
            message: error.message,
        });
    }
};

exports.logOut =async (req,res)=>{
    try {
        res.status(200)
        .cookie("token", "", { // Set the token to an empty string
            expires: new Date(0), // Expire the cookie immediately
            httpOnly: true, // Make the cookie inaccessible to client-side scripts
        })
        .json({
            success:true,
            message:"Logged Out",
        });
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};

exports.followUser =async (req,res)=>{
    try {

        const userToFollow =await User.findById(req.params.id);//param._is is id we provide in with url
        const loggedInUser =await User.findById(req.user._id);//user._id is id we r loggedin with (~token)

        if(!userToFollow){
            return res.status(404).json({
                success:false,
                message:"User not found",
            });
        }

        //if user already follows usertofollow ,..we then unfollow 
        if(loggedInUser.following.includes(userToFollow._id)){
            const indexFollowing=loggedInUser.following.indexOf(userToFollow._id);
            const indexFollowers=loggedInUser.followers.indexOf(loggedInUser._id);

            loggedInUser.following.splice(indexFollowing,1);
            userToFollow.followers.splice(indexFollowers,1);

            await loggedInUser.save();
            await userToFollow.save();

            res.status(200).json({
                success:true,
                message:"User unFollowed",
            });

        }
        else{//if user actually do not follow usertofollow

        loggedInUser.following.push(userToFollow._id);
        userToFollow.followers.push(loggedInUser._id);

        await loggedInUser.save();
        await userToFollow.save();

        res.status(200).json({
            success:true,
            message:"User followed",
        });

        }

        

    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}; 

exports.updatePassword =async (req,res)=>{
    try {
        const user =await User.findById(req.user._id).select("+password");

        const{ oldPassword ,newPassword } =req.body;


        if(!oldPassword || !newPassword){
            return res.status(400).json({
                success:false,
                message:"Please provide old and new password",
            });
        }


        const isMatch =await user.matchPassword(oldPassword);

        if(!isMatch){
             return res.status(400).json({
                success:false,
                message:"Incorrect old Password",
            });
        }
        
        user.password=newPassword;
        await user.save();

        res.status(200).json({
            success:true,
            message:"Password updated",
        });

    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}

exports.updateProfile =async (req,res)=>{
    try {

        const user =await User.findById(req.user._id);

        const {name,email ,avatar} = req.body;

        if(name){
            user.name =name;
        }
        if(email){
            user.email=email;
        }

        if(avatar){
            await cloudinary.v2.uploader.destroy(user.avatar.public_id);//destroy whats user avtar url

            const myCloud = await cloudinary.v2.uploader.upload( avatar ,{ //upload avatar we got in this req body 
                folder :"avatars",
            });
            user.avatar.public_id = myCloud.public_id;
            user.avatar.url = myCloud.secure_url;
        }

        await user.save();

        res.status(200).json({
            success:true,
            message:"Profile updated",
        });

    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};

exports.deleteMyProfile =async (req,res)=>{

    try {
        let user =await User.findById(req.user._id);
        
        const posts=user.posts;//
        const followers=user.followers;//to store follower arr of user b4 deleting user
        const userid=user._id;//
        const following=user.following;

        //removing avatar form cloudinary b4 deleting user
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);

        await User.findByIdAndDelete(req.user._id);//await user.remove();
     
        // Clear token cookie
        res.cookie("token", " ",{expires :new Date(Date.now()) ,httpOnly :true});
        
        //deleting all posts of the user
        for (let i = 0; i < posts.length; i++) {
            const post = await Post.findById(posts[i]);

            await cloudinary.v2.uploader.destroy(post.image.public_id);
            await Post.findByIdAndDelete(posts[i]);
            //await cloudinary.v2.uploader.d estroy(post.image.public_id);
        }


        //removing user from the all of followers following arr
        for (let ind = 0; ind < followers.length; ind++) {
            const follower=await User.findById(followers[ind]);//finding followers from User model

            const index=follower.following.indexOf(userid);//inside follower obj ,find the index of user(us) in the following array of (each/all)follower  
             follower.following.splice(index ,1);
             await follower.save();
        }


        //removing user from following's follower
        for (let ind = 0; ind < following.length; ind++) {
            const follows=await User.findById(following[ind]);//following[index]-will give following users id
//follows is as in whom user follows . User is a follower of (follows).
            const index=follows.followers.indexOf(userid);
            follows.followers.splice(index,1);
            await follows.save();               
        }


        //remov'g all comments of the user from all posts
        const allposts =await Post.find(); //gettingthe posts arr
        
        for (let i = 0; i < allposts.length; i++) {
            const indvpost =await Post.findById(allposts[i]._id);

            for (let j = 0; j < allposts.comments.length; j++) {
                if(indvpost.comments[j].user ===userid){
                    indvpost.comments.splice(j,1);
                }
            }
            
            await indvpost.save();
        }


         //remov'g all likes of the user from all posts
         
         for (let i = 0; i < allposts.length; i++) {
             const indvpost =await Post.findById(allposts[i]._id);
 
             for (let j = 0; j < allposts.likes.length; j++) {
                 if(indvpost.likes[j] === userid){
                     indvpost.likes.splice(j,1);
                 }
             }
             
             await indvpost.save();
         }
        

        res.status(200).json({
            success: true,
            message: "Profile Deleted",
          });

    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        });
    }

}


exports.myProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user._id).populate(
        "posts followers following"
      );
  
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  
  exports.getUserProfile = async (req, res) => {
    try {
      const user = await User.findById(req.params.id).populate(
        "posts followers following"
      );
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  
  exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.find({name :{$regex: req.query.name , $options: 'i' }
    });
  
      res.status(200).json({
        success: true,
        users,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

exports.forgotPassword = async (req,res)=>{

    try {

        const user= await User.findOne({email: req.body.email});

        if(!user){
            return res.status(404).json({
                success:false,
                message: "User not found",
            });
        }

        const resetPasswordToken = user.getResetPasswordToken();
        await user.save();

        const resetUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetPasswordToken}`;// !!!!!!..   ${req.get("host")} did not work ,cdidnt get /api/v1 in route
        const message =`Reset your password by clicking on the link below: \n\n ${resetUrl}`;

        try{
            await sendEmail({//sending resetlink w msg to email of user
                email: user.email,
                subject:"Reset Password",
                message,
            });

            res.status(200).json({
               success: true,
               message: `Email sent to ${user.email}`,
            });
        }
        catch(error){//setting resetpassword token to undefined ;the case where we catch it to fail
            
            user.resetPasswordToken=undefined;
            user.resetPasswordExpire=undefined;
            await user.save();

            res.status(500).json({
                success:false,
                message:error.message,
            });
        }
        
    } catch (error) {//if sending mail not reached/failed
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


exports.resetPassword =async (req,res)=>{

    try{

        const resetPasswordToken= crypto //we take token from params ,encrypt it using same algo ,we used earlier on token we stored in our usermodel n then compare both
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

        const user =await User.findOne({
            resetPasswordToken,
            resetPasswordExpire:{$gt: Date.now()},
        });

        if (!user) {
            return res.status(401).json({
              success: false,
              message: "Token is invalid or has expired",
            });
          }


        user.password =req.body.password;

       user.resetPasswordExpire=undefined;
       user.resetPasswordToken=undefined;
       await user.save();

       res.status(200).json({
        success: true,
        message: "Password Updated",
       });       

    }catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
 

exports.getMyPosts = async (req, res) => {
    try {
       //console.log('user id' ,req.user._id) 
      const user  = await User.findById(req.user._id);
  
      const posts = [];

      for (let i = 0; i < user.posts.length; i++) {
        const post =await Post.findById(user.posts[i]).populate("likes comments.user owner");
        posts.push(post);
        
      }

      res.status(200).json({
        success: true,
        posts,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


exports.getUserPosts = async (req, res) => {
    try {
       //console.log('user id' ,req.user._id) 
      const user  = await User.findById(req.params.id);
  
      const posts = [];

      for (let i = 0; i < user.posts.length; i++) {
        const post =await Post.findById(user.posts[i]).populate("likes comments.user owner");
        posts.push(post);
        
      }

      res.status(200).json({
        success: true,
        posts,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };