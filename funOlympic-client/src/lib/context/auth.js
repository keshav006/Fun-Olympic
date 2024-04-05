import { redirect } from "next/navigation";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("user");

  useEffect(() => {
    if (isLoggedIn) {
      // fetchUser();
      //
      console.log("user is logged in");
    }
  }, [isLoggedIn]);

  const signInUser = (token, role) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
    setRole(role);
    router.push("/");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setRole("");
    redirect("/");
  };

  const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("User is not loggedin to logout");
    }
    return token;
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        logout,
        getToken,
        signInUser,
        setIsLoggedIn,
        role,
        setRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
