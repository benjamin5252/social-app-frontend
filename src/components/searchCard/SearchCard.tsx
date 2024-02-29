import './searchCard.scss';
import { AuthContext } from '../../context/authContext';
import { useContext, useEffect } from 'react';
import { UserObj } from '../../libs/interfaces';
import DefaultProfile from '../../assets/user_profile.jpg';

function SearchCard({ userList }: { userList: UserObj[] }) {
  const { currentUser, logout } = useContext(AuthContext);
  useEffect(() => {}, []);
  return (
    currentUser && (
      <div className="searchCard">
        {userList.map((user) => (
          <div title={`${user.name} (${user.username})`} className="row" key={user.id}>
            <div className="user">
              <img
                src={
                  currentUser.profilePic
                    ? process.env.API + '/upload/' + currentUser.profilePic
                    : DefaultProfile
                }
                alt=""
              />
            </div>
            <div className="col">{user.name}</div>{' '}
            <div className="col">({user.username})</div>
            
          </div>
        ))}
      </div>
    )
  );
}

export default SearchCard;
