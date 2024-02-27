import makeRequest from './axios'

const postApi = {
    addPost: (newPost: { desc: string; img: string }) => makeRequest.post('/posts', newPost),
    uploadImg: (blob: Blob, onProgress: (progress: {
      loaded: number;
      total: number;
      progress: number;
      bytes: number;
    })=>void) => {
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
      return makeRequest.request(uploadConfig)
    }
}

export default postApi;