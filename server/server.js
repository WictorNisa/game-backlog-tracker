const express = require("express");
const knex = require("knex")(require("./knexfile").development);
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

//Move everything into folders and files later

//Middleware

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(400).json({ error: "Access denied" });
  }
  jwt.verify(token, "your_jwt_secret", (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};

//Register a new user
app.post("/register", async (req, res) => {
  console.log("Received data:", req.body);

  if (!req.body.userName || !req.body.userEmail || !req.body.userPassword) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const { userEmail, userPassword, userName } = req.body;
    const hashedPassword = await bcrypt.hash(userPassword, 10);

    const existingUser = await knex("users")
      .where({ email: userEmail })
      .first();
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = await knex("users").insert({
      email: userEmail,
      password: hashedPassword,
      username: userName,
    });

    res.status(200).json({ message: "User registered successfully!" });
    return user;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Registration failed" });
  }
});

//login in a user

app.post("/login", async (req, res) => {
  console.log("Received data:", req.body);
  try {
    const { userEmail, userPassword } = req.body;
    const user = await knex("users").where({ email: userEmail }).first();

    console.log("Retrieved user from database:", user);

    if (!user) {
      console.log("No user found with email:", userEmail);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user || !(await bcrypt.compare(userPassword, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, "your_jwt_secret", {
      expiresIn: "1h",
    });

    // Explicitly include ALL user details
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username, // Make sure this matches your database column
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Detailed login error:", error);
    res.status(500).json({
      error: "Login failed",
      details: error.message,
      fullError: error,
    });
  }
});

// Get all games from database
app.get("/games", authenticateToken, async (req, res) => {
  try {
    const games = await knex("games").select("*");
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: "Database query failed" });
  }
});

//post games to database
app.post("/games", async (req, res) => {
  try {
    const { title, platform, status, rating } = req.body;
    await knex("games").insert({ title, platform, status, rating });
    res.status(201).json({ message: "Game added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add game" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
