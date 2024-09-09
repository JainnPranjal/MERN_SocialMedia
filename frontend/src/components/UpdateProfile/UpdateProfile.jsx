import './UpdateProfile.css'
import React, { useEffect, useState } from 'react';
import { Avatar ,Typography ,Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser, updateProfile } from '../../Actions/User';
import { useAlert } from 'react-alert';
import Loader from '../Loader/Loader';

const UpdateProfile = () => {
   
    const {loading ,error ,user } =useSelector(state => state.user);
    const {loading :updateLoading ,error :updateError , message } =useSelector(state => state.like); //state.like ,coz thats where we creaetd our updateProfile reducer ,,,,in likeReducer

    const [name, setName] =useState(user.name);
    const [email, setEmail] =useState(user.email);
    const [avatar, setAvatar] =useState(" ");
    const [avatarPreview, setAvatarPreview] =useState(user.avatar.url);
    
    const dispatch = useDispatch();
    const alert = useAlert();

    const submitHandler =async(e)=>{
        e.preventDefault();
         await dispatch(updateProfile(name ,email ,avatar));
        dispatch(loadUser());
    }

    const handleImageChange =(e)=>{
        const file =e.target.files[0];
 
        if (file) {  // Ensure that the file is selected
         const Reader = new FileReader();
         Reader.readAsDataURL(file);
 
         Reader.onload = () => { // Ensure the file is properly loaded
             if (Reader.readyState === 2) {
                 
                setAvatarPreview(Reader.result);
                setAvatar(Reader.result);
             }
         };
        } else {
         alert.error("Please select a valid image file.");
        }
     };

     useEffect(() => {
        if(error){
            alert.error(error);
            dispatch({type : "clearErrors"});
        }  
        if(updateError){
            alert.error(updateError);
            dispatch({type : "clearErrors"});
        }  
        
        if(message){
            alert.success(message);
            dispatch({type : "clearMessage"});
        }  
     } ,[dispatch ,error ,alert ,updateError ,message]);

  return (
    loading ? <Loader/> : (
        <div className="updateProfile">
        <form className="updateProfileForm" onSubmit={submitHandler}>
            <Typography variant="h3 " style={{ padding: "2vmax"}}>
                Social App
            </Typography>
 
            <Avatar 
               src={avatarPreview}
               alt='User'
               sx={{ height: "10vmax", width :"10vmax"}}
            />

            <input type="file"  accept='image/*' onChange={handleImageChange} />

            <input 
              type='text'
              value={name}
              placeholder='Name'
              className='updateProfileInputs'
              required
              onChange={(e)=> setName(e.target.value)}

              />

            <input 
              type="email"
              placeholder='Email'
              id="email"
              required 
              value={email}
              className='updateProfileInputs'
              onChange={(e)=> setEmail(e.target.value)}
              
              />


            <Button disabled={updateLoading}  type="submit"> Update</Button>


        </form>
    </div>
    )
  );
}

export default UpdateProfile