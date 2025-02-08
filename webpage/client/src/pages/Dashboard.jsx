import { useContext } from "react";
import { UserContext } from "../../context/userContext";
// import axios from "axios";

export default function Dashboard() {
  const { user } = useContext(UserContext);
  
  // const getProfile = async () => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     const response = await axios.get('/profile', {
  //         headers: {
  //             'Authorization': `Bearer ${token}`
  //         }
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <div>
      <h1>Dashboard</h1>
      {!!user && <h2>Hi {user.firstName} {user.lastName}!</h2>}
      {/* <input type="button" onClick={getProfile} value="Preferences" /> */}
    </div>
  );
}
