import axios from "axios";
import { createContext, useState, useEffect } from "react";
import PropTypes from 'prop-types';

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext({});

export function UserContextProvider({children}) {
    const [user, setUser] = useState(null);
    
    const fetchUser = async () => {
        try {
            const {data} = await axios.get("/profile");
            setUser(data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{user, setUser, fetchUser}}>
            {children}
        </UserContext.Provider>
    )
}

UserContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};