import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "../ComponentCSS.css";
import AuthService from '../../Service/AuthService';
import { AuthContext } from '../../Context/AuthContext';

const Profile = () => {
  let { user, isAuthenticated } = useContext(AuthContext);
  let { username } = useParams();
  let [ profileState, setProfileState] = useState(0);
  let [ profileData, setProfileData ] = useState(null);

  let [ isLoaded, setIsLoaded ] = useState(false); 

  useEffect(() => {
    AuthService.getProfile({ username })
      .then(res => {
        if (isAuthenticated) {
          if (user.username === username) {
            console.log("User is Viewing their own profile!");
            setProfileState(0);
            setProfileData(user);
          } else {
            console.log("User is Viewing another profile!");
            setProfileState(1);
            setProfileData(res.user);
          }
        } else {
          console.log("Guest is viewing another profile!");
          setProfileState(2);
          setProfileData(res.user);
        }
        setIsLoaded(true);
      })
      .catch(err => console.log(err));
  }, [isAuthenticated, username, user]);

  const displayProfile = () => {
    switch(profileState) {
      case 0: 
        return <ProfileType0 />
      case 1:
        return <ProfileType1 />
      default:
        return <ProfileType2 />
    }
  }

  // A User is viewing their own profile
  const ProfileType0 = () => {
    return (
      <h1>{`Welcome to ${profileData.username}'s profile!`}</h1>
    )
  }

  // A User is viewing a different profile
  const ProfileType1 = () => {
    return(
      <h1>{`Welcome to ${profileData.username}'s profile!`}</h1>
    )
  }

  // A Guest is viewing the profile
  const ProfileType2 = () => {
    return(
      <>
        <div className="card m-4">
          <div className="card-body">
            <h1>{`Welcome to ${profileData.username}'s profile!`}</h1>
            <h3>{`Friends: ${profileData.friends.length}`}</h3>
            <h3>{`Total Wins: ${profileData.stats.wins}`}</h3>
            <h3>{`Wins As White: ${profileData.stats.whiteWins}`}</h3>
            <h3>{`Wins AS Black: ${profileData.stats.blackWins}`}</h3>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="container align-center">
      {isLoaded ? displayProfile() : null}
    </div>
  )
}

export default Profile;