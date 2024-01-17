import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import  makeRequest  from "../../axios";
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import moment from "moment";

const Comments = ({postId}) => {
  const { currentUser } = useContext(AuthContext);

  const { status, data, error, isFetching } = useQuery({
    queryKey: ["comments"],
    queryFn: () => {
     return makeRequest.get("/comments?postId="+postId).then((res) => res.data);
    },
  });


  const queryClient = useQueryClient()
  const [desc, setDesc] = useState("")
  const mutation = useMutation({
    mutationFn: (newComment) => {
          return makeRequest.post("/comments", newComment)
    },
    onSuccess: ()=>{
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    }
  })

  const handleClick = (e)=>{
    e.preventDefault()
    mutation.mutate({desc, postId})
    setDesc("")
  }
  
  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilePic} alt="" />
        <input type="text" value={desc} onChange={(e)=>{setDesc(e.target.value)}} placeholder="write a comment" />
        <button onClick={handleClick}>Send</button>
      </div>
      {isFetching ? "Loading" : error ? "Something went wrong" : data.content.map((comment) => (
        <div className="comment">
          <img src={comment.profilePic} alt="" />
          <div className="info">
            <span>{comment.name}</span>
            <p>{comment.desc}</p>
          </div>
          <span className="date">{moment(comment.createdAt).fromNow()}</span>
        </div>
      ))}
    </div>
  );
};

export default Comments;
