import './navbar.scss';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { DarkModeContext } from '../../context/darkModeContext';
import { AuthContext } from '../../context/authContext';
import UserOption from '../userOption/UserOption';
import DefaultProfile from '../../assets/user_profile.jpg';
import userApi from '../../api/user';
import SearchCard from '../searchCard/SearchCard';
import { UserObj } from '../../libs/interfaces';

const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);
  const [optionOpen, setOptionOpen] = useState(false);
  const [searchStr, setSearchStr] = useState<string>('');
  const [openSearchCard, setOpenSearchCard] = useState<boolean>(false);
  const [userList, setUserList] = useState<UserObj[]>([]);

  const handleSearch = async () => {
    try {
      if (searchStr) {
        setOpenSearchCard(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  console.log('currentUser', currentUser);

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

        <form
          className="search"
          action=""
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <SearchOutlinedIcon />
          <input
            type="text"
            placeholder="Search User ID..."
            onChange={(e) => {
              setSearchStr(e.target.value);
            }}
          />
        </form>
      </div>
      <div className="right">
        {/* {currentUser && (
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
        )}

        <NotificationsOutlinedIcon /> */}
        <div
          className="user"
          onClick={() => {
            setOptionOpen(!optionOpen);
          }}
        >
          {currentUser && (
            <>
              <img
                src={
                  currentUser.profilePic
                    ? process.env.API + '/upload/' + currentUser.profilePic
                    : DefaultProfile
                }
                alt=""
              />
              <span>{currentUser.name}</span>
              {optionOpen && <UserOption />}
            </>
          )}
        </div>
      </div>
      {openSearchCard && (
        <SearchCard
          setSearchStr={setSearchStr}
          searchStr={searchStr}
          setOpen={setOpenSearchCard}
        />
      )}
    </div>
  );
};

export default Navbar;
