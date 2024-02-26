import './leftBar.scss';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import { useContext } from 'react';
import DefaultProfile from '../../assets/user_profile.jpg';

const LeftBar = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          {currentUser && (
            <Link
              to={`/profile/${currentUser.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="user">
                <img
                  src={
                    currentUser.profilePic
                      ? process.env.API + '/upload/' + currentUser.profilePic
                      : DefaultProfile
                  }
                  alt=""
                />
                <span>{currentUser.name}</span>
              </div>
            </Link>
          )}

          {/* <div className="item">
            <img src={Friends} alt="" />
            <span>Friends</span>
          </div>
          <div className="item">
            <img src={Messages} alt="" />
            <span>Messages</span>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
