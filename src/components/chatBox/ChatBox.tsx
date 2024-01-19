import React from 'react';
import { WebSocketContext } from '../../context/webSocketContext';
import { AuthContext } from '../../context/authContext';
import { useEffect, useState, useContext } from 'react';
import './chatBox.scss';
import { UserObj, msgObj } from '../../libs/interfaces.js';

const ChatBox = ({
  friend,
  closeChat,
}: {
  friend: UserObj;
  closeChat: VoidFunction;
}) => {
  const { wsMessage, wsSentObj, isWsConnected, wsMessageCount } =
    useContext(WebSocketContext);
  const { currentUser } = useContext(AuthContext);
  const [recievedMsg, setReceivedMsg] = useState<msgObj[]>([]);
  const [msgToSend, setMsgToSend] = useState<string>('');
  const [isMinimized, setIsMinimized] = useState(false);
  useEffect(() => {
    try {
      const wsMsgObj = JSON.parse(wsMessage);
      console.log(wsMsgObj);
      if (wsMsgObj.reply === 'sendChatMessage' && wsMsgObj.message) {
        //
        setReceivedMsg([...recievedMsg, wsMsgObj]);
      }
    } catch (err) {
      console.log(err.message);
    }
  }, [wsMessage]);

  const sendMsg = (msg: string) => {
    if (isWsConnected) {
      const sendAt = Date.now();
      if (msg) {
        setReceivedMsg([
          ...recievedMsg,
          {
            reply: 'sendChatMessage',
            message: msg,
            from: currentUser.id,
            to: friend.id,
            sendAt,
          },
        ]);
        wsSentObj({
          method: 'sendChatMessage',
          message: msg,
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
      {!isMinimized && (
        <>
          <div className="history">
            {/* chat history */}
            <div>
              {recievedMsg.map((Msg) => (
                <div
                  key={'msg-' + Msg.sendAt}
                  className={Msg.from === currentUser.id ? 'right' : 'left'}
                >
                  {!(Msg.from === currentUser.id) && (
                    <img
                      src={'http://localhost:8000/upload/' + friend.profilePic}
                      alt=""
                    />
                  )}

                  <div className="content">{Msg.message}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="editor">
            <input
              value={msgToSend}
              onChange={(e) => setMsgToSend(e.target.value)}
              type="text"
            />
            <button onClick={() => sendMsg(msgToSend)}>{'Send >'}</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBox;
