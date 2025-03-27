import React from "react";
import { useAuth } from "../../context/AuthContext";

const Home = () => {
  const { user, logout } = useAuth();
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      <p>Email: {user.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Home;
