import makeRequest from './axios';

const likeApi = {
  getLikes: (postId: number | string) => makeRequest.get(`/likes/${postId}`),
  addLike: (postId: number | string) => makeRequest.put(`/likes/${postId}`),
  deleteLike: (postId: number | string) =>
    makeRequest.delete(`/likes/${postId}`),
};

export default likeApi;
