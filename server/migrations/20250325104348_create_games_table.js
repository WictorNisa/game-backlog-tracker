exports.up = function (knex) {
  return knex.schema.createTable("games", (table) => {
    table.increments("id").primary();
    table.string("title").notNullable();
    table.string("platform").notNullable();
    table.string("status").notNullable();
    table.integer("rating").nullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("games");
};
