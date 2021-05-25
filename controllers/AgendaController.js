const knex = require('../database/dbConfig');
const { show } = require('./ProdutoController');
const { store, destroy } = require('./UsuarioController');

module.exports = {
    //Show::Retorna um elemento de id específico (Não testado)
    async show(req, res) {
        const id = req.params.id;

        try {
            const dados = await knex
                .select('a.id', 'p.nome as nome_produto', 'p.id as id_produto', 'a.quantidade', 'a.data_limite')
                .from('agendamentos as a')
                .where('a.id', id)
                .join('produtos as p', 'a.produto_id', '=', 'p.id');
            /*  .join('tipo_produto as t', 'p.tipo_produto_id', '=', 't.id')
             .join('usuarios as u', 'p.usuario_id', '=', 'u.id'); */
            if (dados.length > 0)
                res.status(200).json(dados);
            else
                res.status(404).json({ msg: `Nenhum elemento com ID ${id} encontrado` });
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    },

    //Index::Listagem 
    async index(req, res) {
        try {
            const dados = await knex
                .select('a.id', 'u.nome as usuario', 'p.nome as produto', 'p.id as produto_id', 'a.quantidade', 'a.data_limite')
                .from('agendamentos as a')
                .join('produtos as p', 'a.produto_id', '=', 'p.id')
                .join('usuarios as u', 'a.usuario_id', '=', 'u.id');

            res.status(200).json(dados);
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    },

    //Store::Criar/Armazenar
    async store(req, res) {
        const { quantidade, data_limite, produto_id, usuario_id } = req.body;

        //Validação::Verica se todos os campos foram passados
        if (!quantidade || !data_limite || !produto_id || !usuario_id) {
            res.status(400).json({ erro: "Dados insuficientes, informar todos os campos requeridos.", dados: req.body });
            return;
        }

        try {
            const novoAgendamento = await knex('agendamentos').insert({ quantidade, data_limite, produto_id, usuario_id });
            res.status(201).json({ id: novoAgendamento[0] });
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    },

    //Destroy::Remove o elemento do DB
    async destroy(req, res) {
        const id = req.params.id;

        try {
            await knex('agendamentos').where('id', id).del();
            res.status(200).json({ msg: `Agendamento (ID:${id} ) removido com sucesso!` });
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    },

    async dadosEstatisticos(req, res) {
        try {
             const dados = await knex
                .select('t.tipo as tipo_de_produto')
                .count('t.tipo as quantidade_de_agendamentos')
                .from('tipo_produto as t')
                .join('produtos as p', 'p.tipo_produto_id', '=', 't.id')
                .join('agendamentos as a', 'a.produto_id', '=', 'p.id')
                .sum('a.quantidade as total_de_produtos')
                .groupBy('t.tipo');          

            res.status(200).json(dados);
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    }
}