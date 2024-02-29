import makeRequest from './axios';

const commentApi = {
  getComments: (postId: string | number) =>
    makeRequest.get('/comments?postId=' + postId),
  addComment: (comment: { desc: string; postId: string | number }) =>
    makeRequest.post(`/comments`, comment),
};

export default commentApi;
