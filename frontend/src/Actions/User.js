import axios from 'axios';

export const loginUser =(email ,password) => async (dispatch) =>{

    try {
        
        dispatch({ type: "LoginRequest",});

        //api requesst via axios-data fetching
        const {data} =await axios.post(   
            "http://localhost:4001/api/v1/login",{ email ,password }  //not using proxy server as locaohost://4001
            ,{ withCredentials: true },{
                headers :{
                    "Content-Type" :"application/json",
                },
            }
        );
       localStorage.setItem('token', data.token);

        dispatch({ type: "LoginSuccess", payload: data.user,});
    } catch (error) {
        dispatch({ type: "LoginFailure",
            payload: error.response.data.message, });
    }
};

export const loadUser =()=>async (dispatch) =>{
    try {

        dispatch({type: "LoadUserRequest", });

        // const token = localStorage.getItem('token'); // or sessionStorage.getItem('token');
        //const config = { headers: { 'Authorization': `Bearer ${token}` } }; //this step is manually adding token to header ,this is when we are using token from authorization header ,we extract token from auth header in n/w of dev tools of browser but instead we can have middleware to fetch token from cookies direclty
            
            // No need to manually add the token to headers; it will be included in cookies
            const config = { withCredentials: true }; // Ensure cookies are sent with the request

            // Set withCredentials: true in the request(from get api req here) configuration to ensure cookies are sent with the request.

            const { data } = await axios.get('http://localhost:4001/api/v1/me', config);

            dispatch({
                type: "LoadUserSuccess",
                payload: data.user,
            });
        
    } 
    catch (error) {
        console.error("Error in loadUser:", error); // Log full error details
        console.error("Error Response Data:", error.response?.data); // Log the response data
        console.error("Error Response Status:", error.response?.status); // Log the status code
        console.error("Error Config:", error.config); // Log the request config
        dispatch({ type: "LoadUserFailure", payload: error.response?.data?.message || error.message });
    }
    

};

export const getFollowingPosts = () => async (dispatch) => {
    try {
      dispatch({
        type: "postOfFollowingRequest",
      });
      
      const config = {
        withCredentials: true, // Include cookies in the request
      };
    
      const { data } = await axios.get('http://localhost:4001/api/v1/posts', config);
    
      dispatch({
        type: "postOfFollowingSuccess",
        payload: data.posts, 
      });
    } catch (error) {
      dispatch({
        type: "postOfFollowingFailure",
        payload: error.response.data.message,
      });
    }
  };


export const getAllUSers = () => async (dispatch) => {
    try {
      dispatch({
        type: "allUsersRequest",
      });
      
      const config = {
        withCredentials: true, // Include cookies in the request
      };
    
      const { data } = await axios.get('http://localhost:4001/api/v1/users', config);
    
      dispatch({
        type: "allUsersSuccess",
        payload: data.users, 
      });
    } catch (error) {
      dispatch({
        type: "allUsersFailure",
        payload: error.response.data.message,
      });
    }
};


export const getMyPosts = () => async (dispatch) => {
  try {
    dispatch({
      type: "myPostsRequest",
    });
    
    const config = {
      withCredentials: true, 
    };
  
    const { data } = await axios.get('http://localhost:4001/api/v1/my/posts', config);
  
    dispatch({
      type: "myPostsSuccess",
      payload: data.posts, 
    });
  } catch (error) {
    dispatch({
      type: "myPostsFailure",
      payload: error.response.data.message,
    });
  }
};


export const logoutUser =() => async (dispatch) =>{

  try {
      
      dispatch({ type: "LogoutUserRequest",});

      await axios.get('http://localhost:4001/api/v1/logout', {
        withCredentials: true, // Ensure cookies are included in the request
      });
  
      // Clear the token from localStorage, sessionStorage, and cookies
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');

    // Clear the cookie manually
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    dispatch({ type: "LogoutUserSuccess" });
      
  } catch (error) {
      dispatch({ type: "LogoutUserFailure",
          payload: error.response.data.message, });
  }
};



export const registerUser =(name, avatar, email ,password) => async (dispatch) =>{

  try {
      
      dispatch({ type: "RegisterRequest",});

      const {data} =await axios.post(   
          "http://localhost:4001/api/v1/register",
          { name, avatar,email ,password } ,
          {
            withCredentials: true, // Ensure cookies are sent
            headers: {
                "Content-Type": "application/json",
            },
        }
      );

      //document.cookie = `token=${data.token}; path=/;`; //already did this in backend
    
      dispatch({ type: "RegisterSuccess", payload: data.user,});
  } catch (error) {
      dispatch({ type: "RegisterFailure",
          payload: error.response.data.message, });
  }
};



export const updateProfile =(name,email , avatar  ) => async (dispatch) =>{

  try {
      
      dispatch({ type: "updateProfileRequest",});

      const {data} =await axios.put(   
          "http://localhost:4001/api/v1/update/profile",
          { name, avatar,email } ,
          {
            withCredentials: true, // Ensure cookies are sent
            headers: {
                "Content-Type": "application/json",
            },
        }
      );

     
      dispatch({ type: "updateProfileSuccess", payload: data.message ,});
  } catch (error) {
      dispatch({ type: "updateProfileFailure",
          payload: error.response.data.message || error.message, });
  }
};


export const updatePassword =(oldPassword , newPassword) => async (dispatch) =>{

  try {
      
      dispatch({ type: "updatePasswordRequest",});

      const {data} =await axios.put(   
          "http://localhost:4001/api/v1/update/password",
          { oldPassword , newPassword } ,
          {
            withCredentials: true, // Ensure cookies are sent
            headers: {
                "Content-Type": "application/json",
            },
        }
      );

     
      dispatch({ type: "updatePasswordSuccess", payload: data.message ,});
  } catch (error) {
      dispatch({ type: "updatePasswordFailure",
          payload: error.response.data.message || error.message, });
  }
};




























// Assuming the token is stored in localStorage
// const token = localStorage.getItem('token');

// axios.get('http://localhost:4001/api/v1/me', {
//   headers: {
//     Authorization: `Bearer ${token}`,
//   },
// })
// .then(response => {
//   console.log(response.data);
// })
// .catch(error => {
//   console.error('Error fetching user data:', error);
// });