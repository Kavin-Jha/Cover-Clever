import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { toast } from "react-hot-toast";

export default function Navbar() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      setUser(null);
      toast.success('Logged out successfully!');
      navigate('/login');
    } catch (err) {
      console.log(err);
      toast.error('Logout failed');
    }
  };

  return (
    <nav>
      <div>
        <Link to="/">Home</Link>
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
        <Link to="/questionnaire">Questionnaire</Link>
      </div>
      {user && (
        <div id="user-nav">
          <Link to="/dashboard">Dashboard</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}
