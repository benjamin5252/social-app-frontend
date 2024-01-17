import { Link } from "react-router-dom";
import { useState } from "react";
import axios from 'axios'
import "./register.scss";

const Register = () => {

  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: ""
  })

  const [err, setErr] = useState(null)

  const handleChange = (e) =>{
    setInputs(prev=>({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleClick = async (e) =>{
    e.preventDefault()

    try{
      await axios.post("http://localhost:8000/api/auth/register", inputs)
    }catch(err){
      setErr(err.response.data.message)
    }
  }
  return (
    <div className="register">
      <div className="card">
   
        <div className="right">
          <h1>Register</h1>
          <form>
            <input type="text" placeholder="Username" name="username" onChange={handleChange}/>
            <input type="email" placeholder="Email" name="email" onChange={handleChange}/>
            <input type="password" placeholder="Password" name="password" onChange={handleChange}/>
            <input type="text" placeholder="Name" name="name" onChange={handleChange}/>
            <button onClick={handleClick}>Register</button>
          </form>
          {err && <>
            <div>
              {err}
            </div>
          </>}
          <div>or</div>
          
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
