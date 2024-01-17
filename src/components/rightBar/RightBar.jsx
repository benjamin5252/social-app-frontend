import "./rightBar.scss";
import  makeRequest  from "../../axios";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { useEffect, useState, useContext } from "react";
import { WebSocketContext } from "../../context/webSocketContext.jsx";

const RightBar = () => {
  const [onLineFriendList, setOnlineFriendList] = useState([])
  const { wsMessage, wsSentObj, isWsConnected } = useContext(WebSocketContext);
  const { data, isFetching, error} = useQuery({
    queryKey: ["friendsList"],
    queryFn: () => {
      
      const req = makeRequest.get("/relationships/friends").then((res) => res.data);
      
      return req
     
    },
  });

  
  useEffect(()=>{
  
    if(data && data.result){
      setTimeout(()=>{
        if(isWsConnected){
          wsSentObj({method: 'getOnlineUserList', friendList: data.content.map(item=>item.followedUserId)})
        }
      }, 1000)
      
    }
  },[data, isWsConnected, wsSentObj])

  useEffect(()=>{

    try{
      const wsMsgObj = JSON.parse(wsMessage)
      console.log(wsMsgObj)
      if(wsMsgObj.reply === 'getOnlineUsers' && wsMsgObj.onlineFriendList){
        setOnlineFriendList(wsMsgObj.onlineFriendList)
      }
    }catch(err){
      console.log(err.message)
    }
    
  }, [wsMessage])


  return (
    <div className="rightBar">
      <div className="container">
        
        <div className="item">
          <span>Online Friends</span>
          {data && data.content && data.content.filter((item)=> onLineFriendList.includes(item.id)).map((item)=>
          <div key={`online-${item.id}`} className="user">
            <div  className="userInfo">
              <img
                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <div className="online" />
              <span>{item.name} ({item.username})</span>
            </div>
          </div>)}
         
        </div>
      </div>
    </div>
  );
};

export default RightBar;
