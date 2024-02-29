import './rightBar.scss';
import makeRequest from '../../api/axios.js';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState, useContext } from 'react';
import { WebSocketContext } from '../../context/webSocketContext.jsx';
import ChatBox from '../chatBox/ChatBox.js';
import { UserObj } from '../../libs/interfaces.js';
import DefaultUserPic from '../../assets/user_profile.jpg';
import relationshipApi from '../../api/relationship.js';

const RightBar = () => {
  const [onLineFriendList, setOnlineFriendList] = useState<number[]>([]);
  const { wsMessage, wsSentObj, isWsConnected } = useContext(WebSocketContext);
  const [isUpdateFriendList, setIsUpdateFriendList] = useState<boolean>(false);
  const { data } = useQuery({
    queryKey: ['friendsList'],
    queryFn: () => {
      const req = relationshipApi.getFriendList().then((res) => res.data);

      return req;
    },
  });

  useEffect(() => {
    if (data && data.result && !isUpdateFriendList) {
      setTimeout(() => {
        if (isWsConnected) {
          wsSentObj({
            method: 'updateFriendList',
            friendList: data.content.map(
              (item: UserObj) => item.followedUserId,
            ),
          });
          setIsUpdateFriendList(true);
        }
      }, 1000);
    }
  }, [data, isWsConnected, wsSentObj, isUpdateFriendList]);

  useEffect(() => {
    try {
      const wsMsgObj = JSON.parse(wsMessage);
      if (wsMsgObj.reply === 'getOnlineUsers' && wsMsgObj.onlineFriendList) {
        setOnlineFriendList(wsMsgObj.onlineFriendList);
      } else if (wsMsgObj.reply === 'sendChatMessage') {
        for (const user of data.content) {
          if (user.id === wsMsgObj.from) {
            setUserToChat(user);
          }
        }
      }
    } catch (err) {
      let errorMessage = 'Failed to do something exceptional';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      console.log(errorMessage);
    }
  }, [wsMessage, data]);

  const [userToChat, setUserToChat] = useState<null | UserObj>(null);

  return (
    <>
      <div className="rightBar">
        <div className="container">
          <div className="item">
            <span>Online Friends</span>
            {data &&
              data.content &&
              data.content
                .filter((item: UserObj) => onLineFriendList.includes(item.id))
                .map((item: UserObj) => (
                  <div
                    onClick={() => setUserToChat(item)}
                    key={`online-${item.id}`}
                    className="user"
                  >
                    <div className="userInfo">
                      <img
                        src={
                          item.profilePic
                            ? process.env.API + '/upload/' + item.profilePic
                            : DefaultUserPic
                        }
                        alt=""
                      />
                      <div className="online" />
                      <span>
                        {item.name} ({item.username})
                      </span>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
      {userToChat && (
        <ChatBox friend={userToChat} closeChat={() => setUserToChat(null)} />
      )}
    </>
  );
};

export default RightBar;
