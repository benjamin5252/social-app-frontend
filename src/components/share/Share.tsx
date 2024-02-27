import './share.scss';
import ImageIcon from '../../assets/img.png';
// import Map from '../../assets/map.png';
import { useContext, useState, MouseEvent, ChangeEvent } from 'react';
import { AuthContext } from '../../context/authContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import postApi from '../../api/post';
import DefaultProfile from '../../assets/user_profile.jpg';
import LinearProgress from '@mui/material/LinearProgress';

const Share = () => {
  const [file, setFile] = useState<File | null>(null);
  const [desc, setDesc] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const { currentUser } = useContext(AuthContext);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newPost: { desc: string; img: string }) => {
      return postApi.addPost(newPost);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setDesc('');
      setFile(null);
      setIsSharing(false);
      setUploadProgress(100);
    },
  });

  const handleClick = async (e: MouseEvent) => {
    e.preventDefault();
    setUploadProgress(0);
    setIsSharing(true);
    let imgUrl: string | undefined = '';
    if (file) {
      imgUrl = await upload();
    }
    if (imgUrl) mutation.mutate({ desc, img: imgUrl });
  };

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

      w = 320;

      h = w / aspectRatio;

      if (h > window.innerHeight * 0.6) {
        h = window.innerHeight * 0.6;
        w = h * aspectRatio;
      }

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

  const onProgress = (progress: {
    loaded: number;
    total: number;
    progress: number;
    bytes: number;
  }) => {
    setUploadProgress((progress.loaded / progress.total) * 100);
  };

  const upload = async (): Promise<string | undefined> => {
    try {
      if (file) {
        const resizedBlob = await resizeImageFile(file);
        if (resizedBlob) {
          const res = await postApi.uploadImg(resizedBlob, onProgress);
          return res.data;
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    currentUser && (
      <div className="share">
        {isSharing ? (
          <div className="container">
            <div className="uploadingText">
              <div>Uploading the post.</div>
            </div>
            <LinearProgress variant="determinate" value={uploadProgress} />
          </div>
        ) : (
          <div className="container">
            <div className="top">
              <div className="left">
                <img
                  src={
                    currentUser.profilePic
                      ? process.env.API + '/upload/' + currentUser.profilePic
                      : DefaultProfile
                  }
                  alt="DefaultProfile"
                />
                <input
                  type="text"
                  placeholder={`What's on your mind ${currentUser.name}?`}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>
              <div className="right">
                {file && (
                  <img
                    className="file"
                    alt=""
                    src={URL.createObjectURL(file)}
                  />
                )}
              </div>
            </div>
            <hr />
            <div className="bottom">
              <div className="left">
                <input
                  type="file"
                  id="file"
                  style={{ display: 'none' }}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    if (e.target && e.target.files && e.target.files[0])
                      setFile(e.target.files[0]);
                  }}
                />
                <label htmlFor="file">
                  <div className="item">
                    <img src={ImageIcon} alt="" />
                    <span>Add Image</span>
                  </div>
                </label>
                {/* <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div> */}
                {/* <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div> */}
              </div>
              <div className="right">
                <button onClick={handleClick}>Share</button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  );
};

export default Share;
