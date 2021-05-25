exports.up = (knex) => {
    return knex.schema.createTable('tipo_produto', (table) => {
        table.increments();
        table.string('tipo', 100).notNullable();
        // created_at e updated_at
        table.timestamps(true, true);

    })
};

exports.down = (knex) => knex.schema.dropTable('tipo_produto');