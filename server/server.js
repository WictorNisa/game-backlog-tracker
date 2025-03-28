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

app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.path}`);
  next();
});

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

//Get a single game from database
app.get("/games/:id", authenticateToken, async (req, res) => {
  try {
    const game = await knex("games").where({ id: req.params.id }).first();
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch game" });
  }
});

//Add a new game to database
// In your games POST endpoint
app.post("/games", authenticateToken, async (req, res) => {
  try {
    const {
      title,
      platform,
      genre,
      publisher,
      release_date,
      image_url,
      description,
      rawg_id, // Add this field
    } = req.body;

    // Check if game with this RAWG ID already exists
    let existingGame = null;
    if (rawg_id) {
      existingGame = await knex("games").where({ rawg_id }).first();
    }

    if (existingGame) {
      // Return existing game ID if found
      return res
        .status(200)
        .json({ id: existingGame.id, message: "Game already exists" });
    }

    // Add new game
    const [gameId] = await knex("games").insert({
      title,
      platform,
      genre,
      publisher,
      release_date,
      image_url,
      description,
      rawg_id,
    });

    res.status(201).json({ id: gameId, message: "Game added successfully" });
  } catch (error) {
    console.error("Error adding game:", error);
    res.status(500).json({ error: "Failed to add game" });
  }
});

//Get user's game library

// Get user's game library
app.get("/library", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const userGames = await knex("user_games")
      .join("games", "user_games.game_id", "=", "games.id")
      .where({ user_id: userId })
      .select(
        "games.*",
        "user_games.status",
        "user_games.start_date",
        "user_games.completion_date",
        "user_games.notes"
      );

    res.json(userGames);
  } catch (error) {
    console.error("Error fetching library:", error);
    res.status(500).json({ error: "Failed to fetch library" });
  }
});

app.post("/library", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { game_id, status, notes } = req.body;

    // First, check if the game exists in the games table
    const game = await knex("games").where({ id: game_id }).first();
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    // Then check if the game is already in the user's library
    // Fix: Query user_games table, not games table
    const existing = await knex("user_games")
      .where({ user_id: userId, game_id })
      .first();

    if (existing) {
      return res
        .status(400)
        .json({ message: "Game already exists in your library" });
    }

    // Add the game to the user's library
    await knex("user_games").insert({
      user_id: userId,
      game_id,
      status: status || "backlog",
      notes,
      start_date: status === "playing" ? new Date() : null,
    });

    res.status(201).json({ message: "Game successfully added to library" });
  } catch (error) {
    console.error("Error adding game to library:", error); // Add this to see the exact error
    res.status(500).json({ error: "Failed to add game to library" });
  }
});

//Add game to user's library
app.post("/library", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { game_id, status, notes } = req.body;

    const game = await knex("games").where({ id: game_id }).first();
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    const existing = await knex("games")
      .where({ user_id: userId, game_id })
      .first();

    if (existing) {
      return res
        .status(400)
        .json({ message: "Game already exists in your library" });
    }

    await knex("user_games").insert({
      user_id: userId,
      game_id,
      status: status || "backlog",
      notes,
      start_date: status === "playing" ? new Date() : null,
    });

    res
      .status(201)
      .json({ message: "Game added successfully added to library" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add game to library" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
