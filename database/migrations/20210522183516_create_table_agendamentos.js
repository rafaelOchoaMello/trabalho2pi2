exports.up = function (knex) {
    return knex.schema.createTable('agendamentos', (table) => {
        table.increments();
        table.integer('quantidade').notNullable().unsigned();
        table.date('data_limite').notNullable();

        //Rel. Produtos
        table.integer('produto_id').notNullable().unsigned();
        table.foreign('produto_id')
            .references('produtos.id')
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
    });
};

exports.down = (knex) => knex.schema.dropTable('agendamentos');
