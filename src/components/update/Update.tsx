import {
  useState,
  SetStateAction,
  ChangeEvent,
  MouseEvent,
  Dispatch,
} from 'react';
import './update.scss';
import makeRequest from '../../axios';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { UpdateUserObj, UserObj } from '../../libs/interfaces';

interface UpdateProps {
  user: UserObj;
  setOpenUpdate: Dispatch<SetStateAction<boolean>>;
}

export const Update = ({ setOpenUpdate, user }: UpdateProps) => {
  // const [cover, setCover] = useState<File | null>(null);
  const [profile, setProfile] = useState<File | null>(null);
  const [texts, setTexts] = useState({
    name: '',
    city: '',
    website: '',
    email: '',
    password: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTexts((prev) => ({
      ...prev,
      [e.target.name]: [e.target.value],
    }));
  };

  const upload = async (file: File): Promise<string | undefined> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await makeRequest.post('/upload', formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (user: UpdateUserObj) => {
      return makeRequest.put('/users', user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const handleSubmit = async (e: MouseEvent) => {
    e.preventDefault();
    // const coverUrl = cover ? await upload(cover) : user.coverPic;
    const profileUrl = profile ? await upload(profile) : user.profilePic;
    mutation.mutate({ ...texts, profilePic: profileUrl });
    setOpenUpdate(false);
  };

  return (
    <div className="update">
      <div className="wrapper">
        <h1>Update Your Profile</h1>
        <form>
          <div className="files">
            {/* <label htmlFor="cover">
              <span>Cover Picture</span>
              <div className="imgContainer">
                <img
                  src={
                    cover
                      ? URL.createObjectURL(cover)
                      : process.env.API + '/upload/' + user.coverPic
                  }
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input
              type="file"
              id="cover"
              style={{ display: 'none' }}
              onChange={(e) => setCover(e.target.files[0])}
            /> */}
            <label htmlFor="profile">
              <span>Profile Picture</span>
              <div className="imgContainer">
                <img
                  src={
                    profile
                      ? URL.createObjectURL(profile)
                      : process.env.API + '/upload/' + user.profilePic
                  }
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input
              type="file"
              id="profile"
              style={{ display: 'none' }}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                if (e.target && e.target.files && e.target.files[0]) {
                  setProfile(e.target.files[0]);
                }
              }}
            />
          </div>
          <label>Email</label>
          <input
            type="text"
            value={texts.email}
            name="email"
            onChange={handleChange}
          />
          <label>Password</label>
          <input
            type="text"
            value={texts.password}
            name="password"
            onChange={handleChange}
          />
          <label>Name</label>
          <input
            type="text"
            value={texts.name}
            name="name"
            onChange={handleChange}
          />
          <label>Country / City</label>
          <input
            type="text"
            name="city"
            value={texts.city}
            onChange={handleChange}
          />
          <label>Website</label>
          <input
            type="text"
            name="website"
            value={texts.website}
            onChange={handleChange}
          />
          <button onClick={handleSubmit}>Update</button>
        </form>
        <button className="close" onClick={() => setOpenUpdate(false)}>
          close
        </button>
      </div>
    </div>
  );
};

export default Update;
