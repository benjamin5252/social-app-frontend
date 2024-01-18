import React from 'react';
import { WebSocketContext } from "../../context/webSocketContext.jsx";
import { useEffect, useState, useContext } from "react";
import "./chatBox.scss"
import { UserObj } from '../../lib/interfaces.js';

const ChatBox = ({friend, closeChat}: {friend:  UserObj, closeChat: VoidFunction}) => {
  const { wsMessage, wsSentObj, isWsConnected, wsMessageCount } = useContext(WebSocketContext);
  const [ recievedMsg, setReceivedMsg ] = useState<string[]>([])
  const [ msgToSend, setMsgToSend ] = useState<string>('')
  useEffect(()=>{

    try{
      const wsMsgObj = JSON.parse(wsMessage)
      console.log(wsMsgObj)
      if(wsMsgObj.reply === 'sendChatMessage' && wsMsgObj.message){
        //
        setReceivedMsg([...recievedMsg, wsMsgObj.message])
      }
    }catch(err){
      console.log(err.message)
    }
    
  }, [wsMessage])


  const sendMsg = (msg: string)=>{
    if(isWsConnected){
      wsSentObj({method: 'sendChatMessage', message: msg, to: friend.id})
    }
  }

  useEffect(()=>{

    try{
      const wsMsgObj = JSON.parse(wsMessage)
      console.log(wsMsgObj)
      if(wsMsgObj.reply === 'getOnlineUsers' && wsMsgObj.onlineFriendList){
        //
      }
    }catch(err){
      console.log(err.message)
    }
    
  }, [wsMessage, wsMessageCount])

  return (
    <div className='chatBox'>
      <div>
        <div>{friend.name} ({friend.username})</div>
        <button onClick={()=>closeChat()}>Close</button>
      </div>
      
      <div>
        {/* chat history */}
        {
          recievedMsg.map((Msg)=><div>
            {Msg}
          </div>)
        }
        
      </div>
      <div>
        <input onChange={(e)=>setMsgToSend(e.target.value)} type="text" />
        <button onClick={()=>sendMsg(msgToSend)}>Send</button>
      </div>
    </div>
    
  )
}

export default ChatBox;