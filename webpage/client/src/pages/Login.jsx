/* eslint-disable no-undef */
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";

export default function Login() {
  const navigate = useNavigate();
  const { fetchUser } = useContext(UserContext);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const loginUser = async (e) => {
    e.preventDefault();
    const { email, password } = data;
    try {
      const { data } = await axios.post("/login", {
        email,
        password,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        setData({});
        await fetchUser();
        toast.success("Login success!");
        // navigate("/questionnaire");
        
        // Communicate with extension
        if (chrome.runtime) {
          chrome.runtime.sendMessage(
            "obhfnegefpkpoicjhfafbibcocbakkoo",
            { 
              type: "LOGIN_SUCCESS",
              userData: data 
            },
            (response) => {
              if (response.status === "success") {
                navigate("/questionnaire");
              }
            }
          );
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <form onSubmit={loginUser}>
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter email..."
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter password..."
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
