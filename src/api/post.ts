import makeRequest from './axios';
import { AxiosProgressEvent } from 'axios';
const postApi = {
  addPost: (newPost: { desc: string; img: string }) =>
    makeRequest.post('/posts', newPost),
  uploadImg: (
    blob: Blob,
    onProgress: (progress: AxiosProgressEvent) => void,
  ) => {
    const formData = new FormData();

    const resizedFile = new File([blob], 'image.png');
    formData.append('file', resizedFile);
    const uploadConfig = {
      method: 'post',
      url: '/upload',
      timeout: 20 * 60 * 1000,
      data: formData,
      onUploadProgress: onProgress,
    };
    return makeRequest.request(uploadConfig);
  },
  deletePost: (postId: number | string) =>
    makeRequest.delete(`/posts/${postId}`),
};

export default postApi;
