import axios from 'axios';


export const likePost = (id) => async (dispatch) => {
    try {
      dispatch({
        type: "likeRequest",
      });
      
      const config = {
        withCredentials: true, // Include cookies in the request
      };
    
      const { data } = await axios.get(`http://localhost:4001/api/v1/post/${id}`, config);
    
      dispatch({
        type: "likeSuccess",
        payload: data.message, 
      });
    } catch (error) {
      dispatch({
        type: "likeFailure",
        payload: error.response.data.message,
      });
    }
};

export const addCommentOnPost = (id ,comment) => async (dispatch) => {
  try {
    dispatch({
      type: "addCommentRequest",
    });
    
    
    //   withCredentials: true, // When using withCredentials: true, the browser automatically sends cookies along with the request,
    // then,token is accessed from cookies ,req.cookies.token as definede in middleware be 
  
    const { data } = await axios.put(
      `http://localhost:4001/api/v1/post/comment/${id}`,
      { comment }, // Data to be sent ;req body
      {            // axios configuration object
        withCredentials: true, 
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  
    dispatch({
      type: "addCommentSuccess",
      payload: data.message, 
    });
  } catch (error) {
    dispatch({
      type: "addCommentFailure",
      payload: error.response.data.message,
    });
  }
};



export const deleteCommentOnPost = (id ,commentId) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteCommentRequest",
    });
    
    const { data } = await axios.delete(
      `http://localhost:4001/api/v1/post/comment/${id}`,
      {
        data: { commentId }, // The request body must be included in the data field within the config object
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  
    dispatch({
      type: "deleteCommentSuccess",
      payload: data.message, 
    });
  } catch (error) {
    dispatch({
      type: "deleteCommentFailure",
      payload: error.response.data.message,
    });
  }
};



export const createNewPost = (caption,image) => async (dispatch) => {
  try {
    dispatch({
      type: "newPostRequest",
    });
    
    const { data } = await axios.post( 
      `http://localhost:4001/api/v1/post/upload`,
        {
          caption,
          image,
        },
        { withCredentials: true }
        ,{
          headers :{
              "Content-Type" :"application/json",
          },
        }
      
    );
  
    dispatch({
      type: "newPostSuccess",
      payload: data.message, 
    });
  } catch (error) {
    dispatch({
      type: "newPostFailure",
      payload: error.response.data.message,
    });
  }
};


export const updatePost = (postid,caption) => async (dispatch) => {
  console.log("Post ID before request:", postid);
  try {
    dispatch({
      type: "updateCaptionRequest",
    });
    
    const { data } = await axios.put( 
      `http://localhost:4001/api/v1/post/${postid}`,
        {
          caption,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Credentials included here
        }
      
    );
  
    dispatch({
      type: "updateCaptionSuccess",
      payload: data.message, 
    });
  } catch (error) {
    dispatch({
      type: "updateCaptionFailure",
      payload: error.response.data.message,
    });
  }
};



export const deletePost = (postid) => async (dispatch) => {
  console.log("Post ID before request:", postid);
  try {
    dispatch({
      type: "deletePostRequest",
    });
    
    const { data } = await axios.delete( 
      `http://localhost:4001/api/v1/post/${postid}`,
        {
          withCredentials: true, // Credentials included here
        }
      
    );
  
    dispatch({
      type: "deletePostSuccess",
      payload: data.message, 
    });
  } catch (error) {
    dispatch({
      type: "deletePostFailure",
      payload: error.response.data.message,
    });
  }
};