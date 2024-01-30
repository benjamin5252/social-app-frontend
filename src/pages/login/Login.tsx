import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import { LoadingUiContext } from '../../context/loadingUiContext/loadingUiContext';
import './login.scss';

const Login = () => {
  const [inputs, setInputs] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const [err, setErr] = useState(null);
  const { login } = useContext(AuthContext);
  const { setMainLoading } = useContext(LoadingUiContext);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setMainLoading(true);
      await login(inputs);
      setMainLoading(false);
      navigate('/');
    } catch (err) {
      console.log(err);
      setMainLoading(false);
      setErr(err.response.data.message);
    }
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
              <div>{err}</div>
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
