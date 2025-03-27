import { User } from "../../types/types";

interface userData {
  userName: string;
  userEmail: string;
  userPassword: string;
}

interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

interface loginData {
  userEmail: string;
  userPassword: string;
}

export const signUpuser = async (userData: userData) => {
  try {
    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    console.log("Userdata sent successfully to backend:", data);
    return data;
  } catch (error) {
    console.log("Error sending user data:", error);
    throw error;
  }
};

export const loginUser = async (loginData: {
  userEmail: string;
  userPassword: string;
}): Promise<LoginResponse> => {
  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();
    
    // Log the full response for debugging
    console.log("Full login response:", JSON.stringify(data, null, 2));

    // Validate user object with more detailed logging
    if (!data.user) {
      console.error("No user object in response:", data);
      throw new Error("No user data received");
    }

    // Check specific properties
    const requiredProps = ['id', 'username', 'email'];
    const missingProps = requiredProps.filter(prop => !data.user[prop]);
    
    if (missingProps.length > 0) {
      console.error("Missing user properties:", missingProps);
      throw new Error(`Invalid user data: missing ${missingProps.join(', ')}`);
    }

    return data;
  } catch (error) {
    console.error("Detailed login error:", error);
    throw error;
  }
};
