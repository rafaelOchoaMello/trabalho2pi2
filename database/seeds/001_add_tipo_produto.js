
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('tipo_produto').del()
    .then(function () {
      // Inserts seed entries
      return knex('tipo_produto').insert([
        { tipo: 'Foto' },
        { tipo: 'Book' },
        { tipo: 'Chaveiro' },
        { tipo: 'Quadro' },
        { tipo: 'Cartao' },
        { tipo: 'Banner' },
        { tipo: 'Caixa' },
      ]);
    });
};
