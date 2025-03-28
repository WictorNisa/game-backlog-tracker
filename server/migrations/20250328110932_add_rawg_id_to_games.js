exports.up = function(knex) {
    return knex.schema.alterTable("games", (table) => {
      table.integer("rawg_id").nullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.alterTable("games", (table) => {
      table.dropColumn("rawg_id");
    });
  };