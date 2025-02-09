import { useNavigate } from 'react-router-dom';
import "../styles/Navbar.css";
import coverCleverLogo from "../assets/covercleverlogo.png"; // Import the logo


import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
// import { Link } from "react-router-dom";
import { User } from '../types/User';

interface AuthenticatedUser extends User {
    token: string;  // Add token for authenticated users
}

interface NavBarProps {
  user?: AuthenticatedUser | null; // User object or null
  onLogout?: () => void; // Callback for logout
}

export const Navbar: React.FC<NavBarProps> = () => {

    const navigate = useNavigate();

    const handleAccountSettingsOpen = () => {
        navigate('/settings'); // Navigate to settings page
    };

    const handleOpenInNewTab = () => {
        // open the webpage Calvin set up
    }

    return (
        <AppBar position="static">
            <Toolbar style={{ 
                justifyContent: "space-between",
                padding: "0 16px"  // Increased padding
            }}>
                {/* Left side - Logo and Name */}
                <Box className="navbar-logo">
                    <img 
                        src={coverCleverLogo} 
                        alt="Cover Clever Logo" 
                        height="32px"
                    />
                    <Typography 
                        variant="h6" 
                        className="navbar-title"
                        sx={{ 
                            marginLeft: '12px',
                            fontSize: '1.1rem',
                            fontWeight: 500
                        }}
                    >
                        Cover Clever
                    </Typography>
                </Box>

                {/* Right side - Icons */}
                <Box display="flex" alignItems="center" gap={1}>
                    <IconButton
                        onClick={handleOpenInNewTab}
                        color="inherit"
                        aria-label="open in new tab"
                    >
                        <OpenInNewIcon />
                    </IconButton>
                    <IconButton
                        onClick={handleAccountSettingsOpen}
                        color="inherit"
                        aria-label="account settings"
                    >
                        <ManageAccountsIcon />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};