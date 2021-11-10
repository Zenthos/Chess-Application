import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/ComponentCSS.css';
import { UserService } from '../Services/UserService';
import { AuthContext } from '../Context/AuthContext';
import spinner from '../assets/spinner.gif';
import placeholder300 from '../assets/placeholder300.png';

const Profile = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { username } = useParams();
  const [ profileState, setProfileState] = useState(0);
  const [ profileData, setProfileData ] = useState(null);

  const [ isLoaded, setIsLoaded ] = useState(false);

  const dateFormat = { year: 'numeric', month: 'long', day: 'numeric' };

  useEffect(() => {
    UserService.getProfile({ username })
      .then((res) => {
        if (res.userExists) {
          if (isAuthenticated) {
            if (user.username === username)
              setProfileState(0);
            else
              setProfileState(1);
          } else
            setProfileState(2);

          setProfileData(res.user);
        } else
          setProfileState(3);

        setIsLoaded(true);
      })
      .catch(err => console.log(err));
  }, [isAuthenticated, username, user]);

  const displayProfile = () => {
    switch (profileState) {
      case 0:
        return <ProfileType0 />;
      case 1:
        return <ProfileType1 />;
      case 2:
        return <ProfileType2 />;
      default:
        return <NoProfile />;
    }
  };

  const NoProfile = () => {
    return (
      <h1>The User does not Exist</h1>
    );
  };

  // A User is viewing their own profile
  const ProfileType0 = () => {
    return (
      <div className="card m-4">
        <div className="card-body">
          <div className="row">
            <div className="col-sm d-flex align-items-center justify-content-center">
              <img src={placeholder300} className="img-fluid" alt=""></img>
            </div>
            <div className="col-sm">
              <h1>{`${profileData.username}`}</h1>
              <h3>{`Friends: ${profileData.friends.length}`}</h3>
              <h3>{`Total Wins: ${profileData.stats.wins}`}</h3>
              <h3>{`Wins as White: ${profileData.stats.whiteWins}`}</h3>
              <h3>{`Wins as Black: ${profileData.stats.blackWins}`}</h3>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // A User is viewing a different profile
  const ProfileType1 = () => {
    return (
      <div className="card m-4">
        <div className="card-body">
          <div className="row">
            <div className="col-sm d-flex align-items-center justify-content-center">
              <img src={placeholder300} className="img-fluid" alt=""></img>
            </div>
            <div className="col-sm">
              <h1>{`${profileData.username}`}</h1>
              <h3>{`Friends: ${profileData.friends.length}`}</h3>
              <h3>{`Total Wins: ${profileData.stats.wins}`}</h3>
              <h3>{`Wins as White: ${profileData.stats.whiteWins}`}</h3>
              <h3>{`Wins as Black: ${profileData.stats.blackWins}`}</h3>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // A Guest is viewing the profile
  const ProfileType2 = () => {
    return (
      <div className="card m-4">
        <div className="card-body">
          <div className="row">
            <div className="col-sm-3 d-flex align-items-center justify-content-center">
              <img src={placeholder300} className="img-fluid" alt=""></img>
            </div>
            <div className="col-sm-9">
              <h1>{`${profileData.username}`}</h1>
              <h5>{`Total Wins: ${profileData.stats.wins}`}</h5>
              <h5>{`Wins as White: ${profileData.stats.whiteWins}`}</h5>
              <h5>{`Wins as Black: ${profileData.stats.blackWins}`}</h5>
              <p className="m-0">{`Account Created: ${new Date(profileData.stats.dateCreated).toLocaleString(undefined, dateFormat)}`}</p>
              <p className="m-0">{`Last Active: ${new Date(profileData.stats.lastActive).toLocaleString(undefined, dateFormat)}`}</p>
            </div>
          </div>
          <div className="row my-3">
            <div className="col-sm btn btn-secondary">
              Send Friend Request
            </div>
            <div className="col-sm btn btn-secondary">
              Send Message
            </div>
          </div>
          <div className="row">
            <div className="card col-md-8 offset-md-2">
              <p className="m-5">Blurb</p>
            </div>
          </div>
          <div className="row my-4">
            <div className="card col-md-10 offset-md-1">
              <p className="m-5">Achievements</p>
            </div>
          </div>
          <div className="row">
            <div className="card col-md-6 offset-md-3">
              <h5 className="mx-4 mt-3 mb-1">Game History</h5>
              <ul className="list-group border-top-0 h-100 overflow-auto m-0 p-2">

              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container align-center">
      {
        isLoaded ?
          displayProfile()
          :
          <img className="col-sm-2 offset-5" src={spinner} alt="" />
      }
    </div>
  );
};

export default Profile;
