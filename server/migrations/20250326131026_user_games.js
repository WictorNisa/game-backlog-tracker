exports.up = function (knex) {
    return knex.schema.createTable("user_games", (table) => {
      table.increments("id").primary();
      table.integer("user_id").unsigned().notNullable();
      table.integer("game_id").unsigned().notNullable();
      table.string("status").notNullable().defaultTo("backlog"); // playing, completed, backlog
      table.date("start_date").nullable();
      table.date("completion_date").nullable();
      table.integer("play_time").nullable(); // in hours
      table.text("notes").nullable();
      table.timestamps(true, true);
      
      // Foreign key constraints
      table.foreign("user_id").references("id").inTable("users").onDelete("CASCADE");
      table.foreign("game_id").references("id").inTable("games").onDelete("CASCADE");
      
      // Prevent duplicate entries
      table.unique(["user_id", "game_id"]);
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable("user_games");
  };