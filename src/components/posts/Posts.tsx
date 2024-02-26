import Post from '../post/Post';
import './posts.scss';
import { useQuery } from '@tanstack/react-query';
import makeRequest from '../../axios';
import { AxiosResponse } from 'axios';
import { PostObj } from '../../libs/interfaces';

interface PostsProps {
  userId?: number;
}

const Posts = ({ userId }: PostsProps) => {
  const { data, error, isFetching } = useQuery({
    queryKey: ['posts'],
    queryFn: () => {
      if (userId)
        return makeRequest
          .get('/posts?userId=' + userId)
          .then((res) => res.data);
      return makeRequest.get('/posts').then((res: AxiosResponse) => res.data);
    },
  });

  return (
    <div className="posts">
      {(() => {
        if (error) {
          return 'Something went wrong';
        } else if (isFetching) {
          return 'Loading';
        } else {
          return data.content.map((post: PostObj) => (
            <Post post={post} key={post.id} />
          ));
        }
      })()}
    </div>
  );
};

export default Posts;
