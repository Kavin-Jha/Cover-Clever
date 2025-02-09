/**
 * Login Component
 *
 * This component renders a login form for users to authenticate. It supports
 * regular login with email and password, registration redirection, and NFC-based login.
 * The component uses React state to manage form inputs, error handling, and NFC login logic.
 *
 * Features:
 * - Email and password input with validation
 * - Password visibility toggle
 * - Login, Register, and NFC Login functionality
 *
 * Dependencies:
 * - React
 * - Material-UI for styling and layout
 * - React Router for navigation
 * - `loginUser` function from authService for backend authentication
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "../styles/Login.css";
import { loginUser } from "../services/authService";
import { User } from '../types/User';
import { AUTH_CONSTANTS } from '../constants/auth';
import { Navbar } from '../components/Navbar';
import coverCleverLogo from "../assets/covercleverlogo.png";  // Add this import


interface AuthenticatedUser extends User {
  token: string;  // Add token for authenticated users
}

interface LoginProps {
  setUser: (user: AuthenticatedUser) => void;
}

const Login: React.FC<LoginProps> = ({ setUser }) => {
  // State variables for form inputs and error handling
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailHelperText, setEmailHelperText] = useState("");
  const [passwordHelperText, setPasswordHelperText] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  /**
   * Toggles password visibility in the input field
   */
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  /**
   * Prevents default mouse-down behavior on password visibility toggle
   */
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  /**
   * Validates the email input
   * @param email - Email string to validate
   * @returns boolean - Whether the email is valid
   */
  const validateEmail = (email: string): boolean => {
    if (!email) {
      setEmailError(true);
      setEmailHelperText(AUTH_CONSTANTS.ERROR_MESSAGES.EMAIL_REQUIRED);
      return false;
    }
    const isValid = AUTH_CONSTANTS.EMAIL_REGEX.test(email);
    if (!isValid) {
      setEmailError(true);
      setEmailHelperText(AUTH_CONSTANTS.ERROR_MESSAGES.EMAIL_INVALID);
    } else {
      setEmailError(false);
      setEmailHelperText("");
    }
    return isValid;
  };

  /**
   * Validates the password input
   * @param password - Password string to validate
   * @returns boolean - Whether the password is valid
   */
  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError(true);
      setPasswordHelperText(AUTH_CONSTANTS.ERROR_MESSAGES.PASSWORD_REQUIRED);
      return false;
    }
    if (password.length < AUTH_CONSTANTS.MIN_PASSWORD_LENGTH) {
      setPasswordError(true);
      setPasswordHelperText(AUTH_CONSTANTS.ERROR_MESSAGES.PASSWORD_LENGTH);
      return false;
    }
    setPasswordError(false);
    setPasswordHelperText("");
    return true;
  };

  /**
   * Handles the login process using email and password
   */
  const handleLogin = async () => {
    setIsLoading(true);
    
    // Reset error states
    setEmailError(false);
    setPasswordError(false);
    setEmailHelperText("");
    setPasswordHelperText("");

    // Validate both fields
    const isEmailValid = validateEmail(email);
    // const isPasswordValid = validatePassword(password);

    if (!isEmailValid) {
      setIsLoading(false);
      return;
    }

    try {
      // Authenticate user
      const response = await loginUser(email, password);

      // Ensure the response matches our AuthenticatedUser type
      const authenticatedUser: AuthenticatedUser = {
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
        medicalConditions: response.medicalConditions,
        insurancePreferenceExplanation: response.insurancePreferenceExplanation,
        incomeLevel: response.incomeLevel,
        desiredBenefits: response.desiredBenefits,
        token: response.token
      };

      setUser(authenticatedUser); // Update user state

      // Only store necessary user data in localStorage
      const userForStorage = {
        email: authenticatedUser.email,
        firstName: authenticatedUser.firstName,
        lastName: authenticatedUser.lastName
      };

      localStorage.setItem("user", JSON.stringify(userForStorage));
      localStorage.setItem("token", authenticatedUser.token); // Store token for API requests

    //   alert("Login successful!");

      navigate("/"); // Redirect to home/dashboard
    } catch (error) {
        const errorMessage = error instanceof Error 
          ? error.message 
          : "An error occurred during login";
        
        setPasswordError(true);
        setPasswordHelperText(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

  /**
   * Redirects to the Register page
   */
  const handleRegister = () => {
    navigate("/register");
  };

  return (
    
    <div className="login-container">
        <Navbar />
        <img 
          alt="cover clever logo" 
          src={coverCleverLogo}
          className="login-logo"
          draggable="false"
        />
      <form onSubmit={(e) => {
        e.preventDefault();
        handleLogin();
      }}>
        <Grid container spacing={3} className="login-content">
          <Grid item xs={12}>
            <Typography variant="h4" className="login-header">
              Cover Clever
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              InputProps={{
                style: { color: "white" },
                'aria-label': 'Email input field',
              }}
              InputLabelProps={{
                style: { color: "white" },
              }}
              label="Email"
              variant="outlined"
              required
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              error={emailError}
              helperText={emailHelperText}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              InputProps={{
                style: { color: "white" },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      sx={{ color: "white" }}
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                style: { color: "white" },
              }}
              label="Password"
              required
              variant="outlined"
              fullWidth
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              error={passwordError}
              helperText={passwordHelperText}
            />
          </Grid>
          <Grid item xs={12} className="login-actions">
            <Button
              type="submit"
              disabled={isLoading}
              sx={{ width: "100%", marginBottom: "10px" }}
              variant="contained"
              color="primary"
              aria-label="Login button"
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : "Login"}
            </Button>
            <Button
              sx={{ width: "100%", marginBottom: "10px" }}
              variant="outlined"
              color="secondary"
              onClick={handleRegister}
              className="register-button"
            >
              Register
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default Login;