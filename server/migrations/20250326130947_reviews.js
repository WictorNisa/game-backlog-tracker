exports.up = function(knex) {
    return knex.schema.createTable("reviews", (table) => {
      table.increments("id").primary();
      table.integer("user_id").unsigned().notNullable();
      table.integer("game_id").unsigned().notNullable();
      table.integer("rating").unsigned().notNullable(); // 1-10 rating
      table.text("review_text").nullable();
      table.boolean("contains_spoilers").defaultTo(false);
      table.timestamps(true, true);
      
      // Foreign key constraints
      table.foreign("user_id").references("id").inTable("users").onDelete("CASCADE");
      table.foreign("game_id").references("id").inTable("games").onDelete("CASCADE");
      
      // A user can only review a game once
      table.unique(["user_id", "game_id"]);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable("reviews");
  };