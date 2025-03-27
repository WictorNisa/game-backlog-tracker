exports.up = function(knex) {
    return knex.schema.alterTable("games", (table) => {
      // Remove the status column (it's moving to user_games)
      table.dropColumn("status");
      
      // Add new column
      table.string("publisher").nullable();
      table.date("release_date").nullable();
      table.string("image_url").nullable();
      table.text("description").nullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.alterTable("games", (table) => {
      // If we need to roll back, we'll restore the status column
      table.string("status").notNullable().defaultTo("backlog");
      
      // And remove the new columns
      table.dropColumn("genre");
      table.dropColumn("publisher");
      table.dropColumn("release_date");
      table.dropColumn("image_url");
      table.dropColumn("description");
    });
  };