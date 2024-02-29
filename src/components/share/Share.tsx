import './share.scss';
import ImageIcon from '../../assets/img.png';
// import Map from '../../assets/map.png';
import { useContext, useState, MouseEvent, ChangeEvent } from 'react';
import { AuthContext } from '../../context/authContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import postApi from '../../api/post';
import DefaultProfile from '../../assets/user_profile.jpg';
import LinearProgress from '@mui/material/LinearProgress';
import { AxiosProgressEvent } from 'axios';
import uploadApi from '../../api/upload';

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

  const onProgress = (progress: AxiosProgressEvent) => {
    if (progress.total) {
      setUploadProgress((progress.loaded / progress.total) * 100); //mui progress takes in 100 as full value
    } else {
      setUploadProgress(0);
    }
  };

  const upload = async (): Promise<string | undefined> => {
    try {
      if (file) {
        const res = await uploadApi.uploadImgFile(file, onProgress);
        if (res) {
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
