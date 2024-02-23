import './share.scss';
import ImageIcon from '../../assets/img.png';
import Map from '../../assets/map.png';
import Friend from '../../assets/friend.png';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import makeRequest from '../../axios';
import DefaultProfile from '../../assets/user_profile.jpg';

const Share = () => {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState('');

  const { currentUser } = useContext(AuthContext);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newPost) => {
      return makeRequest.post('/posts', newPost);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setDesc('');
      setFile(null);
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    let imgUrl = '';
    if (file) {
      imgUrl = await upload();
    }
    mutation.mutate({ desc, img: imgUrl });
  };

  const resizeImageFile = (blob) => {
    const blobUrl = URL.createObjectURL(blob);

    return new Promise((resolve, reject) => {
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

      // REMINDER
      // 256x256 = 65536 pixels with 4 channels (RGBA) = 262144 data points for each image
      // Data is encoded as Uint8ClampedArray with BYTES_PER_ELEMENT = 1
      // So each images = 262144bytes
      // 1000 images = 260Mb

      let canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      let ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, w, h);

      return new Promise((resolve) => {
        canvas.toBlob(resolve); // implied image/png format
      });
    });
  };

  const upload = async () => {
    try {
      const formData = new FormData();
      const resizedBlob = await resizeImageFile(file);
      const resizedFile = new File([resizedBlob], 'image.png');
      formData.append('file', resizedFile);
      const res = await makeRequest.post('/upload', formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="share">
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
              <img className="file" alt="" src={URL.createObjectURL(file)} />
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
              onChange={(e) => setFile(e.target.files[0])}
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
    </div>
  );
};

export default Share;
