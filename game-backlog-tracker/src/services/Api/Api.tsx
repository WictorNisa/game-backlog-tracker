import { User } from "../../types/types";
const RAWG_API_KEY = "482756f0f018479eb45c2673695958f4"; // Better to use environment variables
const RAWG_BASE_URL = "https://api.rawg.io/api";

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

export const fetchFromRAWG = async (endpoint: string, params = {}) => {
  const queryParams = new URLSearchParams({
    key: RAWG_API_KEY,
    ...params,
  });

  const response = await fetch(`${RAWG_BASE_URL}${endpoint}?${queryParams}`);

  if (!response.ok) {
    throw new Error(
      `RAWG API error: ${response.status} ${response.statusText}`
    );
  }

  return await response.json();
};

//Fetch users currently playing games( max 4)
export const getAllUserGames = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch("http://localhost:3000/library", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Fetching user library was successful", data);
    return data;
  } catch (error) {
    console.error("Error fetching user library:", error);
    throw error; // Make sure to throw the error so it can be caught by the caller
  }
};

// Register new user fetch
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

//Login user fetch
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
    const requiredProps = ["id", "username", "email"];
    const missingProps = requiredProps.filter((prop) => !data.user[prop]);

    if (missingProps.length > 0) {
      console.error("Missing user properties:", missingProps);
      throw new Error(`Invalid user data: missing ${missingProps.join(", ")}`);
    }

    return data;
  } catch (error) {
    console.error("Detailed login error:", error);
    throw error;
  }
};
