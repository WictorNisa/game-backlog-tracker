import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Safely parse user from localStorage
    try {
      const storedUserJson = localStorage.getItem("user");
      return storedUserJson ? JSON.parse(storedUserJson) : null;
    } catch (error) {
      // If parsing fails, clear the localStorage item
      localStorage.removeItem("user");
      return null;
    }
  });

  useEffect(() => {
    // Additional safety check in useEffect
    try {
      const storedUserJson = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUserJson && storedToken) {
        const parsedUser = JSON.parse(storedUserJson);
        setUser(parsedUser);
      }
    } catch (error) {
      // Handle parsing error
      console.error("Error parsing user from localStorage:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
    }
  }, []);

  const login = (token: string, userData: User) => {
    console.log("Logging in:", userData);

    try {
      // Store token and user data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
    } catch (error) {
      console.error("Error storing user data:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
