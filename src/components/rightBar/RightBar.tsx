import "./rightBar.scss";
import  makeRequest  from "../../axios.js";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { useEffect, useState, useContext } from "react";
import { WebSocketContext } from "../../context/webSocketContext.jsx";
import ChatBox from "../chatBox/ChatBox.js"
import { UserObj } from "../../lib/interfaces";

const RightBar = () => {
  const [onLineFriendList, setOnlineFriendList] = useState([])
  const { wsMessage, wsSentObj, isWsConnected } = useContext(WebSocketContext);
  const [isUpdateFriendList, setIsUpdateFriendList] = useState(false)
  const { data, isFetching, error} = useQuery({
    queryKey: ["friendsList"],
    queryFn: () => {
      
      const req = makeRequest.get("/relationships/friends").then((res) => res.data);
      
      return req
     
    },
  });

  
  useEffect(()=>{
  
    if(data && data.result && !isUpdateFriendList){
      setTimeout(()=>{
        if(isWsConnected){
          wsSentObj({method: 'updateFriendList', friendList: data.content.map(item=>item.followedUserId)})
          setIsUpdateFriendList(true)
        }
      }, 1000)
      
    }
  },[data, isWsConnected, wsSentObj, isUpdateFriendList])

  useEffect(()=>{

    try{
      const wsMsgObj = JSON.parse(wsMessage)
      console.log(wsMsgObj)
      if(wsMsgObj.reply === 'getOnlineUsers' && wsMsgObj.onlineFriendList){
        setOnlineFriendList(wsMsgObj.onlineFriendList)
      }else if(wsMsgObj.reply === 'sendChatMessage' ){
        for(const user of data.content){
          if(user.id === wsMsgObj.from){
            setUserToChat(user)
          }
        }
       
      }
    }catch(err){
      console.log(err.message)
    }
    
  }, [wsMessage])



  const [userToChat, setUserToChat] = useState<null | UserObj>(null)


  return (
    <div className="rightBar">
      <div className="container">
        
        <div className="item">
          <span>Online Friends</span>
          {data && data.content && data.content.filter((item)=> onLineFriendList.includes(item.id)).map((item)=>
          <div onClick={()=>setUserToChat(item)} key={`online-${item.id}`} className="user">
            <div  className="userInfo">
              <img
                src={"http://localhost:8000/upload/" +  item.profilePic}
                alt=""
              />
              <div className="online" />
              <span>{item.name} ({item.username})</span>
            </div>
          </div>)}
         
        </div>
      </div>
      { userToChat && 
        <ChatBox friend={userToChat} closeChat={()=>setUserToChat(null)} />
      }
      
    </div>
  );
};

export default RightBar;
