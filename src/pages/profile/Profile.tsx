import './profile.scss';
import PlaceIcon from '@mui/icons-material/Place';
import LanguageIcon from '@mui/icons-material/Language';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Posts from '../../components/posts/Posts';
import makeRequest from '../../api/axios';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import { useContext, useState, MouseEvent } from 'react';
import Update from '../../components/update/Update';
import DefaultProfile from '../../assets/user_profile.jpg';
import { AxiosResponse } from 'axios';
import userApi from '../../api/user';
import relationshipApi from '../../api/relationship';

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const userId = useParams().id;

  const { data, error, isFetching } = useQuery({
    queryKey: ['user'],
    queryFn: () => {
      if (userId)
        return userApi.getUser(userId).then((res: AxiosResponse) => res.data);
    },
  });

  const { data: relationshipData, isFetching: rIsFetching } = useQuery({
    queryKey: ['relationship'],
    queryFn: () => {
      return relationshipApi
        .getRelationship(userId)
        .then((res: AxiosResponse) => res.data);
    },
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => {
      if (userId) {
        if (currentUser && relationshipData.content.includes(currentUser.id)) {
          return relationshipApi.deleteRelationship(userId);
        } else {
          return relationshipApi.addRelationship(userId);
        }
      }
      return () => {};
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['relationship'] });
    },
  });

  const handleFollow = (e: MouseEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    currentUser && (
      <div className="profile">
        <div className="images">
          {/* <img
          src={
            isFetching
              ? ''
              : error
                ? 'Something went wrong'
                : data.content.coverPic
                  ? process.env.API + '/upload/' + data.content.coverPic
                  : DefaultProfile
          }
          alt=""
          className="cover"
        /> */}
          <img
            src={
              isFetching
                ? ''
                : error
                  ? 'Something went wrong'
                  : data.content.coverPic
                    ? process.env.API + '/upload/' + data.content.coverPic
                    : DefaultProfile
            }
            alt=""
            className="profilePic"
          />
        </div>
        <div className="profileContainer">
          <div className="uInfo">
            <div className="left">
              {/* <a href="http://facebook.com">
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
            </a> */}
            </div>
            <div className="center">
              <span>
                {isFetching
                  ? ''
                  : error
                    ? 'Something went wrong'
                    : data.content.name}
              </span>
              <div className="info">
                <div className="item">
                  <PlaceIcon />
                  <span>
                    {isFetching
                      ? ''
                      : error
                        ? 'Something went wrong'
                        : data.content.city}
                  </span>
                </div>
                <div className="item">
                  <LanguageIcon />
                  <span>
                    {isFetching
                      ? ''
                      : error
                        ? 'Something went wrong'
                        : data.content.website}
                  </span>
                </div>
              </div>
              {!rIsFetching &&
                !isFetching &&
                (currentUser.id === data?.content?.id ? (
                  <button onClick={() => setOpenUpdate(true)}>Update</button>
                ) : (
                  <button onClick={handleFollow}>
                    {relationshipData.content.includes(currentUser.id)
                      ? 'Following'
                      : 'Follow'}
                  </button>
                ))}
            </div>
            <div className="right">
              <EmailOutlinedIcon />
              <MoreVertIcon />
            </div>
          </div>
          <Posts userId={userId ? parseInt(userId) : undefined} />
        </div>
        {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
      </div>
    )
  );
};

export default Profile;
