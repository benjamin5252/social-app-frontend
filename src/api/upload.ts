import makeRequest from './axios';
import { AxiosProgressEvent } from 'axios';

const resizeImageFile = (blob: File): Promise<Blob | null> => {
  const blobUrl = URL.createObjectURL(blob);

  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = blobUrl;
  }).then((img) => {
    URL.revokeObjectURL(blobUrl);
    // Limit to 256x256px while preserving aspect ratio
    let [w, h] = [img.width, img.height];
    const aspectRatio = w / h;
    // Say the file is 1920x1080
    // divide max(w,h) by 256 to get factor

    w = 200;

    h = w / aspectRatio;


    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, w, h);
    }

    return new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }); // implied image/png format
    });
  });
};

const uploadApi = {
  uploadImgFile: async (
    file: File,
    onProgress?: (progress: AxiosProgressEvent) => void,
  ) => {
    // decrease the img size before upload
    const blob = await resizeImageFile(file);
    const formData = new FormData();
    if (blob) {
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
    }
  },
};

export default uploadApi;
