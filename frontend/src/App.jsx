import './App.css';
import {BrowserRouter as Router,Routes ,Route} from 'react-router-dom';
import Header from './components/Header/Header';
import Login from './components/Login/Login';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { loadUser } from './Actions/User';
import Home from './components/Home/Home';
import Account from './components/Account/Account';
import NewPost from './components/NewPost/NewPost';
import Register from './components/Register/Register';
import UpdateProfile from './components/UpdateProfile/UpdateProfile';
import UpdatePassword from './components/UpdatePassword/UpdatePassword';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';
import UserProfile from './components/UserProfile.jsx/UserProfile';
import Search from './components/Search/Search';
import NotFound from './components/NotFound/NotFound';

function App() {
 
  const dispatch =useDispatch();
  useEffect(()=>{
    dispatch(loadUser());
  },[dispatch]);

  const { isAuthenticated} =useSelector((state) => state.user);
  return (
    <Router>
      {isAuthenticated && <Header/>}
      
      <Routes>
      <Route path='/' element={isAuthenticated ?<Home/> :<Login/>}/>
      <Route 
        path='/Account' 
        element={isAuthenticated ?<Account/> :<Login/>}
      />
      <Route path='/newPost' element={isAuthenticated ?<NewPost/> :<Login/>}/>
       
      <Route 
         path='/update/profile'
         element={isAuthenticated ? <UpdateProfile /> : <Login/>} 
         />

      <Route 
         path='/update/password'
         element={isAuthenticated ? <UpdatePassword /> : <Login/>} 
         />

      <Route 
         path='/forgot/password'
         element={isAuthenticated ? <UpdatePassword /> : <ForgotPassword/>} 
         /> 


      <Route 
         path='/register'
         element={isAuthenticated ? <Account/> :<Register/> }
         />

        <Route 
         path='/password/reset/:token'
         element={isAuthenticated ? <UpdatePassword />  :<ResetPassword/> }
         />

         <Route 
         path='/user/:id'
         element={isAuthenticated ? <UserProfile />  :<Login/> }
         />

         <Route path='/search' 
         element={isAuthenticated ? <Search/>  :<Login/> }
         />

         <Route  path='/*'
         element={<NotFound/>}
         />
      
      </Routes>
    </Router>
  );
}

export default App

















// import './App.css';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Header from './components/Header/Header';
// import Login from './components/Login/Login';
// //import Dashboard from './components/Dashboard/Dashboard'; // Ensure this component exists
// import { useEffect } from 'react';
// import { connect } from 'react-redux';
// import { loadUser } from './Actions/User';
// import Contact from './components/Contact';

// function App({ loadUser, user, isAuthenticated, loading }) {
//   useEffect(() => {
//     loadUser();
//   }, [loadUser]);

//   return (
//     <Router>
//       <Header />
//       <Routes>
//         {/* Public Route */}
//         <Route path="/" element={<Login />} />

//         {/* Protected Route */}
//         <Route
//           path="/search"
//           element={
//             !loading && isAuthenticated ? (
//               <Contact />
//             ) : (
//               <Navigate to="/About" />
//             )
//           }
//         />
//       </Routes>
//     </Router>
//   );
// }

// // Map state and dispatch to props
// const mapStateToProps = (state) => ({
//   user: state.user.user,
//   isAuthenticated: state.user.isAuthenticated,
//   loading: state.user.loading,
// });

// const mapDispatchToProps = { loadUser };

// export default connect(mapStateToProps, mapDispatchToProps)(App);
