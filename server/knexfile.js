module.exports = {
  development: {
    client: "better-sqlite3",
    connection: {
      filename: "./game_backlog.db", // SQLite database file
    },
    useNullAsDefault: true, // Required for SQLite
  },
};