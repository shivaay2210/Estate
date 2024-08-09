import { createContext, useEffect, useState } from "react"

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    console.log(localStorage.getItem("user"));

    const [currentUser, setCurrentUser] = useState(
        // null
        JSON.parse(localStorage.getItem("user")) || null
    )

    const updateUser = (data) => {
        setCurrentUser(data)
    }

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(currentUser))
    }, [currentUser]);
    
    console.log(currentUser);

    return (
        <AuthContext.Provider value={{currentUser, updateUser}}>
            {children}
        </AuthContext.Provider>
    )
}