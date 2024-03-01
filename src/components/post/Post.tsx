import './post.scss';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import TextsmsOutlinedIcon from '@mui/icons-material/TextsmsOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Link } from 'react-router-dom';
import Comments from '../comments/Comments';
import { useState, useContext } from 'react';
import moment from 'moment';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '../../context/authContext';
import DefaultProfile from '../../assets/user_profile.jpg';
import TimeoutImg from '../timeoutImg/timeoutImg';
import { MouseEvent } from 'react';
import { PostObj } from '../../libs/interfaces';
import likeApi from '../../api/like';
import postApi from '../../api/post';

interface PostProps {
  post: PostObj;
}

const Post = ({ post }: PostProps) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { data, error, isFetching } = useQuery({
    queryKey: ['likes', post.id],
    queryFn: () => {
      return likeApi.getLikes(post.id).then((res) => res.data);
    },
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => {
      if (currentUser && data.content.includes(currentUser.id)) {
        return likeApi.deleteLike(post.id);
      } else {
        return likeApi.addLike(post.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['likes'] });
    },
  });

  const handleLike = (e: MouseEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  const { currentUser } = useContext(AuthContext);

  const deleteMutation = useMutation({
    mutationFn: () => {
      return postApi.deletePost(post.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const handleDelete = (e: MouseEvent) => {
    e.preventDefault();
    deleteMutation.mutate();
  };

  return (
    currentUser && (
      <div className="post">
        <div className="container">
          {currentUser && (
            <div className="user">
              <div className="userInfo">
                <img
                  src={
                    post.profilePic
                      ? process.env.API + '/upload/' + post.profilePic
                      : DefaultProfile
                  }
                  alt=""
                />

                <div className="details">
                  <Link
                    to={`/profile/${post.userId}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <span className="name">{post.name}</span>
                  </Link>
                  <span className="date">
                    {moment(post.createdAt).fromNow()}
                  </span>
                </div>
              </div>
              {currentUser.id === post.userId && (
                <>
                  <MoreHorizIcon
                    style={{ cursor: 'pointer' }}
                    onClick={() => setMenuOpen(!menuOpen)}
                  />
                  {menuOpen && <button onClick={handleDelete}>delete</button>}
                </>
              )}
            </div>
          )}

          <div className="content">
            <p>{post.desc}</p>
            {/* <img
            src={post.img ? process.env.API + '/upload/' + post.img : ''}
            alt=""
          /> */}
            <TimeoutImg
              url={post.img ? process.env.API + '/upload/' + post.img : ''}
            />
          </div>
          <div className="info">
            {currentUser && (
              <div className="item" onClick={handleLike}>
                {isFetching ? (
                  ''
                ) : error ? (
                  'Something went wrong.'
                ) : data.content.includes(currentUser.id) ? (
                  <FavoriteOutlinedIcon style={{ color: 'red' }} />
                ) : (
                  <FavoriteBorderOutlinedIcon />
                )}
                {isFetching
                  ? ''
                  : error
                    ? 'Something went wrong.'
                    : data.content.length}{' '}
                likes
              </div>
            )}

            <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
              <TextsmsOutlinedIcon />
              Comments
            </div>
            {/* <div className="item">
            <ShareOutlinedIcon />
            Share
          </div> */}
          </div>
          {commentOpen && <Comments postId={post.id} />}
        </div>
      </div>
    )
  );
};

export default Post;
