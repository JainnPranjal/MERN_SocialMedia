import {configureStore } from "@reduxjs/toolkit"
import { allUsersReducer, postOfFollowingReducer, userReducer ,userProfileReducer } from "./Reducers/User";
import { likeReducer, myPostsReducer, userPostsReducer } from "./Reducers/Post";

const store =configureStore({
    reducer:{
        user:userReducer,
        postOfFollowing:postOfFollowingReducer,
        allUsers:allUsersReducer,
        like:likeReducer,
        myPosts : myPostsReducer,
        userPosts :userPostsReducer,
        userProfile :userProfileReducer,

    },
});

export default store;