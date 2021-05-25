const knex = require("../database/dbConfig");
const bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');

module.exports = {
    //Index::Listagem
    async index(req, res) {
        const usuarios = await knex('usuarios');
        res.status(200).json(usuarios);
    },

    //Store::Criar/Armazenar
    async store(req, res) {
        const { nome, email, senha } = req.body;

        //Validações: Parâmetros recebidos da req. & Existencia do e-mail no DB
        if (!nome || !email || !senha) {
            res.status(400).json({ erro: 'Parâmetros insuficientes, favor informar nome, email e senha' });
            return;
        }

        try {
            const dados = await knex('usuarios').where({ email });
            if (dados.length) {
                res.status(400).json({ erro: 'Este e-mail já se encontra cadastrado.' });
                return;
            }
        } catch (error) {
            res.status(400).json({ erro: error.message });
            return;
        }

        //Registro: Caso esteja tudo OK, vai aos procedimentos para o Store
        const hash = bcrypt.hashSync(senha, 10);

        try {
            const novoUsuario = await knex('usuarios').insert({ nome, email, senha: hash });
            res.status(201).json({ id: novoUsuario[0] });
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    },

    //Update::Put
    async update(req, res) {
        const id = req.params.id;
        const senha = req.body.senha;

        const hash = bcrypt.hashSync(toString(senha), 10);

        try {
            const resultado = await knex('usuarios').where('id', id)
                .update({ senha: hash });
            res.status(201).json({ msg: 'Dados atualizados com sucesso!' });
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    },

    //Destroy::Delete
    async destroy(req, res) {
        const id = req.params.id;

        try {
            const isRemoved = await knex('usuarios').where('id', id).del();
            if(isRemoved)
                res.status(200).json({ msg: 'Remoção realizada com sucesso!' });
            else
                res.status(404).json({msg: 'Usuario não encontrado!'});
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    },

    //Login:: AINDA NÃO DEFINIMOS O JWT_KEY NO ENV
    async login(req, res) {
        const { email, senha } = req.body;

        //Verificações::Checa se todos os dados foram passados
        if (!email || !senha) {
            res.status(400).json({ erro: "Login e/ou senha inválidos" });
            return;
        }

        try {
            const dados = await knex("usuarios").where({ email });
            //Verificações::Checa se o e-mail existe do DB
            if (dados.length == 0) {
                res.status(400).json({ erro: "Login e/ou senha inválidos" });
                return;
            }
            //Verificações::Compara a senha recebida com a registrada
            if (bcrypt.compareSync(senha, dados[0].senha)) {
                //Token::Se tudo OK, vamos criar um token de 1 Hora
                const token = jwt.sign(
                    {
                        usuario_id: dados[0].id,
                        usuario_nome: dados[0].nome
                    },
                    //Utilizamos o env para uma camada a mais de proteção
                    process.env.JWT_KEY,
                    { expiresIn: "1h" }
                );
                res.status(200).json({ token });
            }
            else
                res.status(400).json({ erro: "Login e/ou senha inválidos" });
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    }
}