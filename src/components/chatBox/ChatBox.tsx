import { WebSocketContext } from '../../context/webSocketContext';
import { AuthContext } from '../../context/authContext';
import { useEffect, useState, useContext } from 'react';
import './chatBox.scss';
import { UserObj, msgObj } from '../../libs/interfaces.js';
import DefaultProfile from '../../assets/user_profile.jpg';

const ChatBox = ({
  friend,
  closeChat,
}: {
  friend: UserObj;
  closeChat: VoidFunction;
}) => {
  const { wsMessage, wsSentObj, isWsConnected } = useContext(WebSocketContext);
  const { currentUser } = useContext(AuthContext);
  const [receivedMsg, setReceivedMsg] = useState<msgObj[]>([]);
  const [msgToSend, setMsgToSend] = useState<string>('');
  // const [isMinimized, setIsMinimized] = useState(false);
  useEffect(() => {
    try {
      const wsMsgObj = JSON.parse(wsMessage);
      if (wsMsgObj.reply === 'sendChatMessage' && wsMsgObj.message) {
        //
        setReceivedMsg([...receivedMsg, wsMsgObj]);
      }
    } catch (err) {
      let errorMessage = 'Failed to do something exceptional';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      console.log(errorMessage);
    }
  }, [wsMessage]);

  const sendMsg = (e: MouseEvent) => {
    e.preventDefault();
    if (isWsConnected) {
      const sendAt = Date.now();
      if (msgToSend && currentUser) {
        setReceivedMsg([
          ...receivedMsg,
          {
            reply: 'sendChatMessage',
            message: msgToSend,
            from: currentUser.id,
            to: friend.id,
            sendAt,
          },
        ]);
        wsSentObj({
          method: 'sendChatMessage',
          message: msgToSend,
          from: currentUser.id,
          to: friend.id,
          sendAt,
        });

        setMsgToSend('');
      }
    }
  };

  return (
    <div className="chatBox">
      <div className="title">
        <div className="name">
          {friend.name} ({friend.username})
        </div>
        {/* {
          isMinimized ? 
          <button onClick={() => setIsMinimized(false)}>^</button>
          :
          <button onClick={() => setIsMinimized(true)}>_</button>
        } */}

        <button onClick={() => closeChat()}>x</button>
      </div>
      {
        // !isMinimized &&
        <>
          <div className="history">
            {/* chat history */}
            <div>
              {currentUser &&
                receivedMsg.map((Msg) => (
                  <div
                    key={'msg-' + Msg.sendAt}
                    className={Msg.from === currentUser.id ? 'right' : 'left'}
                  >
                    {!(Msg.from === currentUser.id) && (
                      <img
                        src={
                          friend.profilePic
                            ? process.env.API + '/upload/' + friend.profilePic
                            : DefaultProfile
                        }
                        alt=""
                      />
                    )}

                    <div className="content">{Msg.message}</div>
                  </div>
                ))}
            </div>
          </div>
          <div className="editor">
            <form>
              <input
                value={msgToSend}
                onChange={(e) => setMsgToSend(e.target.value)}
                type="text"
              />
              <button onClick={sendMsg}>{'Send >'}</button>
            </form>
          </div>
        </>
      }
    </div>
  );
};

export default ChatBox;
