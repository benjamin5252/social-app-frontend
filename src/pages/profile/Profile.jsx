import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts"
import  makeRequest  from "../../axios";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { AuthContext } from "../../context/authContext";
import { useContext, useState } from "react";
import  Update  from "../../components/update/Update";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false)
  const { currentUser } = useContext(AuthContext)

  let userId = useParams().id;
  const { status, data, error, isFetching } = useQuery({
    queryKey: ["user"],
    queryFn: () => {
     return makeRequest.get("/users/find/" + userId).then((res) => res.data);
    },
  });

  const { data: relationshipData, isFetching: rIsFetching } = useQuery({
    queryKey: ["relationship"],
    queryFn: () => {
      
      return makeRequest.get("/relationships?followedUserId=" + userId).then((res) => res.data);
      
      
     
    },
  });

  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: () => {
      if(relationshipData.content.includes(currentUser.id)){
        return makeRequest.delete("/relationships?followedUserId=" + userId)
      }else{
        return makeRequest.put("/relationships?followedUserId=" + userId)
      }
          
    },
    onSuccess: ()=>{
      queryClient.invalidateQueries({ queryKey: ['relationship'] })
    }
  })


  const handleFollow = (e) =>{
    console.log('handlefollow')
    e.preventDefault()
    mutation.mutate()
  }

 



  return (
    <div className="profile">
      <div className="images">
        <img
          src={isFetching? "" : error? "Something went wrong": "http://localhost:8000/upload/" + data.content.coverPic}
          alt=""
          className="cover"
        />
        <img
          src={isFetching? "" : error? "Something went wrong": "http://localhost:8000/upload/" +  data.content.profilePic}
          alt=""
          className="profilePic"
        />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <a href="http://facebook.com">
              <FacebookTwoToneIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <InstagramIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <TwitterIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <LinkedInIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <PinterestIcon fontSize="large" />
            </a>
          </div>
          <div className="center">
            <span>{isFetching? "" : error? "Something went wrong": data.content.name}</span>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>{isFetching? "" :  error? "Something went wrong": data.content.city}</span>
              </div>
              <div className="item">
                <LanguageIcon />
                <span>{isFetching? "" :  error? "Something went wrong": data.content.website}</span>
              </div>
            </div>
            { !rIsFetching && !isFetching && (currentUser.id === data?.content?.id ? <button onClick={()=>setOpenUpdate(true)}>Update</button> : 
              <button onClick={handleFollow}>
              {relationshipData.content.includes(currentUser.id) ? "Following" : "Follow"}
            </button>
            )}
          </div>
          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div>
        </div>
      <Posts userId={userId} />
      </div>
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data}/>}
    </div>
  );
};

export default Profile;
