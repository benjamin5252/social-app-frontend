import './searchCard.scss';
import { AuthContext } from '../../context/authContext';
import { useContext, useEffect } from 'react';
import { UserObj } from '../../libs/interfaces';

function SearchCard({ userList }: { userList: UserObj[] }) {
  const { currentUser, logout } = useContext(AuthContext);
  useEffect(() => {}, []);
  return (
    currentUser && (
      <div className="searchCard">
        {userList.map((user) => (
          <div className="row" key={user.id}>
            <div className="col">{user.name}</div>{' '}
            <div className="col">({user.username})</div>
            <div className="col">{user.email}</div>
          </div>
        ))}
      </div>
    )
  );
}

export default SearchCard;
