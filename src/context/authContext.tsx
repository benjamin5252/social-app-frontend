import { createContext, useEffect, useState, ReactNode } from "react";
import axios from 'axios'
export const AuthContext = createContext();

interface Props {
  children?: ReactNode
}

export const AuthContextProvider = ({ children }: Props) => {
  
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user") || 'null') 
  );


  const login = async (inputs: {username: string, password: string}) => {
    
      const res = await axios.post("http://localhost:8000/api/auth/login", inputs, {
        withCredentials: true
      })
      setCurrentUser(res.data.content)
      return res.data
    
  };

  const logout = async () => {
 
      await axios.post("http://localhost:8000/api/auth/logout", {
        withCredentials: true
      })
      setCurrentUser(null)
  
  };

  useEffect(() => {

    
      if(currentUser){
        localStorage.setItem("user", JSON.stringify(currentUser));
      }else{
        localStorage.removeItem("user");
      }
  }, [currentUser]);



  // useEffect(()=>{
    
  //   if(!isWsConnected){
  //     connect()
  //   }
    
  // }, [])

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
