exports.up = function(knex) {
    return knex.schema.alterTable('games', table => {
      table.string('genre').nullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.alterTable('games', table => {
      table.dropColumn('genre');
    });
  };