import './navbar.scss';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { DarkModeContext } from '../../context/darkModeContext';
import { AuthContext } from '../../context/authContext';
import UserOption from '../userOption/UserOption';
import DefaultProfile from '../../assets/user_profile.jpg';

const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);
  const [optionOpen, setOptionOpen] = useState(false);
  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: 'none', cursor: 'pointer' }}>
          <span>Yin's Social</span>
        </Link>
        {darkMode ? (
          <WbSunnyOutlinedIcon style={{ cursor: 'pointer' }} onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon
            style={{ cursor: 'pointer' }}
            onClick={toggle}
          />
        )}
        {/* <div className="search">
          <SearchOutlinedIcon />
          <input type="text" placeholder="Search..." />
        </div> */}
      </div>
      <div className="right">
        <Link
          to={`/profile/${currentUser.id}`}
          style={{
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <PersonOutlinedIcon />
        </Link>
        <NotificationsOutlinedIcon />
        <div
          className="user"
          onClick={() => {
            setOptionOpen(!optionOpen);
          }}
        >
          <img
            src={
              currentUser.profilePic
                ? 'http://localhost:8000/upload/' + currentUser.profilePic
                : DefaultProfile
            }
            alt=""
          />
          <span>{currentUser.name}</span>
          {optionOpen && <UserOption />}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
