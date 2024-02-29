import './searchCard.scss';
import { AuthContext } from '../../context/authContext';
import { useContext, useEffect, useState,Dispatch, SetStateAction, } from 'react';
import { UserObj } from '../../libs/interfaces';
import DefaultProfile from '../../assets/user_profile.jpg';
import userApi from '../../api/user';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';

function SearchCard({ searchStr, setOpen, setSearchStr }: {searchStr: string, setOpen: Dispatch<SetStateAction<boolean>>, setSearchStr: Dispatch<SetStateAction<string>> }) {
  const { currentUser, logout } = useContext(AuthContext);
  const [userList, setUserList] = useState<UserObj[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const getUserList = async ()=>{
      setErrorMsg("");
      try {
        setIsLoading(true)
        const res = await userApi.searchUser(searchStr);
        if (res.data.result) {
          setUserList(res.data.content);
        }
      } catch (err: any) {
        console.log(err);
        setErrorMsg(err.message);
      }
      setIsLoading(false)
    }
    if(searchStr){
      getUserList()
    } else{
      setOpen(false)
    }
  }, [searchStr]);

  const handleClick = (e: any, userId: number)=>{
    e.preventDefault()
    navigate(`/profile/${userId}`)
    setSearchStr("")
  }

  
  return (
    currentUser && (
      <div className="searchCard">
        {(()=>
        {
          if(isLoading){
            return <CircularProgress/>
          }else if(errorMsg){
            return errorMsg
          }
          return userList.map((user) => (
            <div onClick={(e)=>handleClick(e, user.id)} title={`${user.name} (${user.username})`} className="row" key={user.id}>
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
          ))
        })()}
      </div>
    )
  );
}

export default SearchCard;
