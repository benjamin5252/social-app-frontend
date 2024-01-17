import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useState, useContext } from "react";
import moment from "moment"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import  makeRequest from "../../axios"
import { AuthContext } from "../../context/authContext";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false)
  const { status, data, error, isFetching } = useQuery({
    queryKey: ["likes", post.id],
    queryFn: () => {
     return makeRequest.get("/likes/"+post.id).then((res) => res.data);
    },
  });


  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: () => {
      if(data.content.includes( currentUser.id)){
        return makeRequest.delete("/likes/" + post.id)
      }else{
        return makeRequest.put("/likes/" + post.id)
      }
          
    },
    onSuccess: ()=>{
      queryClient.invalidateQueries({ queryKey: ['likes'] })
    }
  })


  const handleLike = (e) =>{
    e.preventDefault()
    mutation.mutate()
  }

  const { currentUser } = useContext(AuthContext);


  const deleteMutation = useMutation({
    mutationFn: (posId) => {
   
        return makeRequest.delete("/posts/" + post.id)

          
    },
    onSuccess: ()=>{
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    }
  })

  const handleDelete = (e)=>{
    e.preventDefault()
    deleteMutation.mutate(post.id)
  }

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={post.profilePic} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{ moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon onClick={()=>setMenuOpen(!menuOpen)} />
          {(currentUser.id === post.userId) && menuOpen && <button onClick={handleDelete}>delete</button>}
        </div>
        <div className="content">
          <p>{post.desc}</p>
          <img src={'http://localhost:8000/upload/' + post.img} alt="" />
        </div>
        <div className="info">
          <div className="item" onClick={handleLike}>
            {isFetching ? "" : error ? "Something went wrong." : data.content.includes( currentUser.id) ? <FavoriteOutlinedIcon style={{color: "red"}} /> : <FavoriteBorderOutlinedIcon />}
            {isFetching ? "" : error ? "Something went wrong." : data.content.length } likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            12 Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default Post;
