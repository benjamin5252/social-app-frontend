import "./leftBar.scss";
import Friends from "../../assets/1.png";
import Groups from "../../assets/2.png";
import Market from "../../assets/3.png";
import Watch from "../../assets/4.png";
import Memories from "../../assets/5.png";
import Events from "../../assets/6.png";
import Gaming from "../../assets/7.png";
import Gallery from "../../assets/8.png";
import Videos from "../../assets/9.png";
import Messages from "../../assets/10.png";
import Tutorials from "../../assets/11.png";
import Courses from "../../assets/12.png";
import Fund from "../../assets/13.png";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";

const LeftBar = () => {

  const { currentUser } = useContext(AuthContext);

  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
        <Link
            to={`/profile/${currentUser.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
          <div className="user">
            <img
              src={"http://localhost:8000/upload/" +  currentUser.profilePic}
              alt=""
            />
            <span>{currentUser.name}</span>
          </div>
          </Link>
          {/* <div className="item">
            <img src={Friends} alt="" />
            <span>Friends</span>
          </div>
          <div className="item">
            <img src={Messages} alt="" />
            <span>Messages</span>
          </div> */}
        </div>
     
        
      </div>
    </div>
  );
};

export default LeftBar;
