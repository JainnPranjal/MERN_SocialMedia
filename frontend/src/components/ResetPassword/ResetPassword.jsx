import React, { useEffect, useState } from 'react';
import './ResetPassword.css';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Typography } from '@mui/material';
import { useAlert } from 'react-alert';
import { resetPassword } from '../../Actions/User';
import { Link, useParams } from 'react-router-dom';


const ResetPassword = () => {

    const [newPassword ,setNewPassword] =useState();   
    const dispatch =useDispatch();
    const alert =useAlert();
    const params =useParams();
    //console.log(params);
    const {error ,loading ,message} =useSelector(state => state.like);

    const submitHandler =(e) =>{
        e.preventDefault(); 
        dispatch(resetPassword(params.token ,newPassword));
    };

    useEffect(() =>{
        if(error){
            alert.error(error);
            dispatch({ type : "clearErrors"});
        }
        if(message){
          alert.success(message);
          dispatch({ type : "clearMessage"});
      }
        
    },[alert ,error ,message , dispatch]);
  

  return (
    <div className='resetPassword'>

        <form className='resetPasswordForm' onSubmit={submitHandler}>
            <Typography variant="h3 " style={{ padding: "2vmax"}}>
                Social App
            </Typography>
 

            <input 
              type="password"
              placeholder='New Password'
              className='updatePasswordInputs'
              required
              value={newPassword}
              onChange={(e)=> setNewPassword(e.target.value)}
            />


            <Link to='/'>
            <Typography> Login</Typography>
            </Link>
            
            <Link to='/forgot/password'>Request ANother Token</Link>
            

            <Button disabled={loading} type="submit">Reset Password</Button>

        </form>
  
    
    </div>
  )
}

export default ResetPassword;