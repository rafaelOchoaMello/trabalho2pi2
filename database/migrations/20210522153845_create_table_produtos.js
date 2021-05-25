exports.up = (knex) => {
    return knex.schema.createTable('produtos', (table) => {
        table.increments();
        table.string('nome', 100).notNullable();
        table.decimal('valor', 9.2).notNullable();
        table.string('foto').notNullable();
        table.boolean('destaque').notNullable().defaultTo(false);

        //Rel. Tipo_Produto
        table.integer('tipo_produto_id').notNullable().unsigned();
        table.foreign('tipo_produto_id')
            .references('tipo_produto.id')
            .onDelete('restrict')
            .onUpdate('cascade');

        //Rel. Usuário
        table.integer('usuario_id').notNullable().unsigned();
        table.foreign('usuario_id')
            .references('usuarios.id')
            .onDelete('restrict')
            .onUpdate('cascade');
            
        // created_at e updated_at
        table.timestamps(true, true);
    })
};

exports.down = (knex) => knex.schema.dropTable('produtos');