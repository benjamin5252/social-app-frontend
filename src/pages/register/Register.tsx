import { Link } from 'react-router-dom';
import { useState, useContext } from 'react';
import axios from 'axios';
import './register.scss';
import { useSnackbar } from 'notistack';
import { LoadingUiContext } from '../../context/loadingUiContext/loadingUiContext';

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [inputs, setInputs] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
  });

  const [err, setErr] = useState(null);
  const { setMainLoading } = useContext(LoadingUiContext);
  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setMainLoading(true);
    try {
      await axios.post(process.env.API + '/upload/', inputs);
      enqueueSnackbar('Success', {
        variant: 'success',
      });
    } catch (err) {
      if (Array.isArray(err.response.data.message)) {
        for (const msg of err.response.data.message) {
          enqueueSnackbar(msg, {
            variant: 'error',
          });
        }
      } else {
        setErr(err.response.data.message);
      }
    }
    setMainLoading(false);
  };
  return (
    <div className="register">
      <div className="card">
        <div className="right">
          <h1>Register</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Name"
              name="name"
              onChange={handleChange}
            />
            <button onClick={handleClick}>Register</button>
          </form>
          {err && (
            <>
              <div className="error">{err}</div>
            </>
          )}
          <div className="orLine">
            <div className="line"></div>
            <div>or</div>
            <div className="line"></div>
          </div>

          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
