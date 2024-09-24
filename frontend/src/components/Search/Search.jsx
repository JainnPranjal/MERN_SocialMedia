import React, { useState } from 'react';
import './Search.css';
import { Button, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUSers } from '../../Actions/User';
import User from '../User/User';

const Search = () => {
    const [name,setName]=useState('');
    const {users ,loading :Loading} = useSelector((state) => state.allUsers)
    
    const dispatch = useDispatch();

    const submitHandler =(e)=>{
        e.preventDefault();
        dispatch(getAllUSers(name));
    }

    
  return (
    
    <div className="search">
        <form className="searchForm" onSubmit={submitHandler}>
            <Typography variant="h3 " style={{ padding: "2vmax"}}>
                Social App
            </Typography>
 
            <input 
              type='text'
              value={name}
              placeholder='Name'
              required
              onChange={(e)=> setName(e.target.value)}

              />

            <Button disabled={Loading} type="submit"> Search</Button>
        
            <div className="searchResults">
            {
                users && users.map((user) => 
                (<User
                    key={user._id}
                    userId={user._id}
                    name={user.name}
                    avatar={user.avatar.url}
                  />  
                ))
            }
           </div>

        </form>

        
    </div>
  )
}

export default Search