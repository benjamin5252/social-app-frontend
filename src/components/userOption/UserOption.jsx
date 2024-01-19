import './userOption.scss';
import { AuthContext } from '../../context/authContext';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

function UserOption() {
  const { logout, currentUser } = useContext(AuthContext);

  const handleLogOut = async () => {
    try {
      await logout();
    } catch (err) {
      console.log(err);
      alert(err.response.data.message || err.response.data);
    }
  };

  return (
    <div className="userOption">
      <Link
        className="option"
        to={`/profile/${currentUser.id}`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        My Profile
      </Link>
      <div className="option" onClick={handleLogOut}>
        Logout
      </div>
    </div>
  );
}

export default UserOption;
