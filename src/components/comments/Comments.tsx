import { useContext, useState, MouseEvent } from 'react';
import './comments.scss';
import { AuthContext } from '../../context/authContext';
import makeRequest from '../../api/axios';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import moment from 'moment';
import DefaultProfile from '../../assets/user_profile.jpg';
import { AxiosResponse } from 'axios';

export interface commentsProps {
  postId: string;
}

export interface comment {
  id: number;
  profilePic: string;
  name: string;
  desc: string;
  createdAt: string;
}

const Comments = ({ postId }: commentsProps) => {
  const { currentUser } = useContext(AuthContext);

  const { data, error, isFetching } = useQuery({
    queryKey: ['comments'],
    queryFn: () => {
      return makeRequest
        .get('/comments?postId=' + postId)
        .then((res: AxiosResponse) => res.data);
    },
  });

  const queryClient = useQueryClient();
  const [desc, setDesc] = useState('');
  const mutation = useMutation({
    mutationFn: (newComment: { desc: string; postId: string }) => {
      return makeRequest.post('/comments', newComment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    mutation.mutate({ desc, postId });
    setDesc('');
  };

  return (
    <div className="comments">
      {currentUser && (
        <div className="write">
          <img
            src={
              currentUser.profilePic
                ? process.env.API + '/upload/' + currentUser.profilePic
                : DefaultProfile
            }
          />
          <input
            type="text"
            value={desc}
            onChange={(e) => {
              setDesc(e.target.value);
            }}
            placeholder="write a comment"
          />
          <button onClick={handleClick}>Send</button>
        </div>
      )}

      {isFetching
        ? 'Loading'
        : error
          ? 'Something went wrong'
          : data.content.map((comment: comment) => (
              <div key={`comment-${comment.id}`} className="comment">
                <img
                  src={
                    comment.profilePic
                      ? process.env.API + '/upload/' + comment.profilePic
                      : DefaultProfile
                  }
                />
                <div className="info">
                  <span>{comment.name}</span>
                  <p>{comment.desc}</p>
                </div>
                <span className="date">
                  {moment(comment.createdAt).fromNow()}
                </span>
              </div>
            ))}
    </div>
  );
};

export default Comments;
