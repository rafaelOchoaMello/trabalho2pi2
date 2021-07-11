const knex = require('../database/dbConfig');
const { index, store, destroy } = require('./UsuarioController');

module.exports = {
    //Show::Retorna um elemento de id específico
    async show(req, res) {
        const id = req.params.id;
        try {
            const dados = await knex
                .select('p.id', 'p.nome', 'p.valor', 'p.foto', 'p.destaque', 't.tipo', 'u.nome as usuario')
                .from('produtos as p')
                .where('p.id', id)
                .join('tipo_produto as t', 'p.tipo_produto_id', '=', 't.id')
                .join('usuarios as u', 'p.usuario_id', '=', 'u.id');

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
                .select('p.id', 'p.nome', 'p.valor', 'p.foto', 'p.destaque', 't.tipo', 'u.nome as usuario')
                .from('produtos as p')
                .join('tipo_produto as t', 'p.tipo_produto_id', '=', 't.id')
                .join('usuarios as u', 'p.usuario_id', '=', 'u.id');
            res.status(200).json(dados);
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    },

    //Store::Criar/Armazenar
    async store(req, res) {
        const { nome, valor, foto, tipo_produto_id, usuario_id } = req.body;

        //Validação::Verica se todos os campos foram passados
        if (!nome || !valor || !foto || !tipo_produto_id || !usuario_id) {
            res.status(400).json({ erro: "Dados insuficientes, informar todos os campos requeridos.", dados: req.body });
            return;
        }

        try {
            //Inserir aqui os dados, depois testar a verificação dos ids para as FK's
            const novoProduto = await knex('produtos').insert({ nome, valor, foto, tipo_produto_id, usuario_id });
            res.status(201).json({ id: novoProduto[0] });
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    },

    //Update::Put
    async update(req, res) {
        const id = req.params.id;
        const { nome, valor, foto } = req.body;

        try {
            await knex('produtos').where('id', id).update({ nome, valor, foto });
            res.status(200).json({ msg: `Dados do produto atualizados com sucesso!` });
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    },

    //Destroy::Delete
    async destroy(req, res) {
        const id = req.params.id;

        try {
            await knex('produtos').where('id', id).del();
            res.status(200).json({ msg: `Produto de id ${id} removido com sucesso!` });
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    },

    //Destaque::Retorna uma listagem com os itens em destaque
    async destaques(req, res) {
        //Proximo a ser feito, deve ser fácil
        //Devemos retornar uma lista com todos os elementos que possuam destaque = True
        try {
            const dados = await knex('produtos').where('produtos.destaque', true);
            if (dados.length > 0)
                res.status(200).json(dados);
            else
                res.status(400).json({ msg: "Não há produtos em destaque." });
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    },

    //Destacar::Alterna o seu valor de 'destaque' (True/False)
    /* <<PS>> Não encontrei uma maneira 'direta' de fazer isto, tendo que 
    *  recorrer a dois acessos distintos ao banco, o primeiro para
    *  capturar os valores (e verificar se os dados existem), e o
    *  segundo para afetivamente realizar o update nos valores da tabela
    */
    async destacar(req, res) {
        const id = req.params.id;

        try {
            const dados = await knex.select('produtos.destaque').from('produtos').where('id', id);
            //Validação::Verificamos se o elemento de id esperado existe no DB
            if (dados.length > 0) {
                //Caso exista::Vamos efetivamente inverter o valor do boolean,
                try {
                    await knex('produtos').where('id', id).update({ destaque: !dados[0].destaque });
                    res.status(200).json({ msg: `Campo 'destaque' do produto ${id} alternado com sucesso!` });
                } catch (error) {
                    res.status(400).json({ erro: error.message });
                }
            }
            else {
                res.status(404).json({ msg: `Produto de ID ${id} não encontrado.` });
            }
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    },

    async filtro(req, res) {
        const palavra = req.body.palavra;

        try {
            const dados = await knex
                .select('p.id', 'p.nome', 'p.valor', 'p.foto', 'p.destaque', 't.tipo')
                .from('produtos as p')
                .where('p.nome', 'like', '%' + palavra + '%')
                .join('tipo_produto as t', 'p.tipo_produto_id', '=', 't.id')

            if (dados.length > 0)
                res.status(201).json(dados);
            else
                res.status(404).json({ msg: `Não foi encontrado nenhum registro de elemento(s) com o nome ${palavra}` });
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    }
}