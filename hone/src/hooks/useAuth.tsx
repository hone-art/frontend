import { createContext, useContext, useMemo, useState, FC, ReactNode, Dispatch } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../globals"


interface AuthContextType {
  user: User | null;
  setUser: Dispatch<React.SetStateAction<User | null>>;
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<React.SetStateAction<boolean>>;
  login: (data: User) => void;
  logout: () => void;
  autoLogin: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type Props = {
  children: ReactNode;
}

export const AuthProvider: FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();

  const autoLogin = async () => {
    const autoLogin = await fetch(`${process.env.API_URL}/autoLogin`, {
      method: "GET",
      credentials: "include",
    })

    if (autoLogin.status == 200) {
      const loggedUser = await autoLogin.json();
      setUser(loggedUser);
      setIsLoggedIn(true);
      return loggedUser;
    }

    return null;
  };

  // call this function when you want to authenticate the user
  const login = (data: User) => {
    setUser(data);
    setIsLoggedIn(true);
    navigate(`/${data?.user_name}`);
    return;
  };

  // call this function to sign out logged in user
  const logout = async () => {
    await fetch(`${process.env.API_URL}/logout`, {
      method: "GET",
      credentials: "include",
    });
    setUser(null);
    setIsLoggedIn(false);
    navigate("/", { replace: true });
    return;
  };

  const value = useMemo(
    () => ({
      user,
      isLoggedIn,
      autoLogin,
      login,
      logout,
      setUser,
      setIsLoggedIn,
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
