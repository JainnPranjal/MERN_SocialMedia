import React, { useEffect, useState } from 'react';
import './Register.css';
import { Avatar ,Typography ,Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../Actions/User';
import { useAlert } from 'react-alert';

const Register = () => {

    const [name, setName] =useState("");
    const [email, setEmail] =useState("");
    const [password, setPassword] =useState("");
    const [avatar, setAvatar] =useState("");// Use a default avatar image if none is uploaded

    const dispatch = useDispatch();
    const alert = useAlert();
    const {loading ,error } =useSelector(state => state.user);

    const submitHandler =(e)=>{
        e.preventDefault();
        dispatch(registerUser(  name, avatar,email ,password));
    }

    const handleImageChange =(e)=>{
        const file =e.target.files[0];
 
        if (file) {  // Ensure that the file is selected
         const Reader = new FileReader();
         Reader.readAsDataURL(file);
 
         Reader.onload = () => { // Ensure the file is properly loaded
             if (Reader.readyState === 2) {
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
     } ,[dispatch ,error ,alert]);

  return (
    <div className="register">
        <form className="registerForm" onSubmit={submitHandler}>
            <Typography variant="h3 " style={{ padding: "2vmax"}}>
                Social App
            </Typography>
 
            <Avatar 
               src={avatar}
               alt='User'
               sx={{ height: "10vmax", width :"10vmax"}}
            />

            <input type="file"  accept='image/*' onChange={handleImageChange} />

            <input 
              type='text'
              value={name}
              placeholder='Name'
              className='registerInputs'
              required
              onChange={(e)=> setName(e.target.value)}

              />

            <input 
              type="email"
              placeholder='Email'
              id="email"
              required 
              value={email}
              className='registerInputs'
              onChange={(e)=> setEmail(e.target.value)}
              
              />

            <input 
              type="password"
              placeholder='Password'
              id="password"
              required
              className='registerInputs'              
              value={password}
              onChange={(e)=> setPassword(e.target.value)}
            />
            
            <Link to='/'> 
             <Typography>
                Already Signed Up ? Login Now
             </Typography> 
             </Link>

            <Button disabled={loading}  type="submit"> Sign up</Button>


        </form>
    </div>
  )
}

export default Register