import { useContext, useState, MouseEvent, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import { LoadingUiContext } from '../../context/loadingUiContext/loadingUiContext';
import './login.scss';
import { useSnackbar } from 'notistack';

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [inputs, setInputs] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const [err, setErr] = useState(null);
  const { login } = useContext(AuthContext);
  const { setMainLoading } = useContext(LoadingUiContext);
  const navigate = useNavigate();
  const handleLogin = async (e: MouseEvent) => {
    e.preventDefault();
    try {
      setMainLoading(true);
      await login(inputs);

      navigate('/');
    } catch (err: any) {
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
    <div className="login">
      <div className="card">
        <div className="right">
          <h1>Login</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            <button onClick={handleLogin}>Login</button>
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
          <div>
            {/* <span>Don't you have an account?</span> */}
            <div>
              <Link to="/register">
                <button>Register</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
