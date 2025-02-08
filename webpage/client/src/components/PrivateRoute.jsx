import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { Navigate } from "react-router-dom";
import PropTypes from 'prop-types';

export default function PrivateRoute({ children }) {
  const { user } = useContext(UserContext);
  
  return user ? children : <Navigate to="/login" />;
} 

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired
}; 