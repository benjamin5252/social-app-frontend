import Post from '../post/Post';
import './posts.scss';
import { useQuery } from '@tanstack/react-query';
import makeRequest from '../../axios';
import { useEffect, useState } from 'react';

const Posts = ({ userId }) => {
  const { status, data, error, isFetching } = useQuery({
    queryKey: ['posts'],
    queryFn: () => {
      if (userId)
        return makeRequest
          .get('/posts?userId=' + userId)
          .then((res) => res.data);
      return makeRequest.get('/posts').then((res) => res.data);
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
          return data.content.map((post) => <Post post={post} key={post.id} />);
        }
      })()}
    </div>
  );
};

export default Posts;
