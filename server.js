
// executar server api '' nodemon server.js '' //
const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'tomando_todas_bd'
    }
});

const restify = require('restify');
const errs = require('restify-errors');

const server = restify.createServer({
    name: 'API_tomando_todas',
    version: '1.0.0'
});
 
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());


const corsMiddleware = require('restify-cors-middleware')
 
const cors = corsMiddleware({
  preflightMaxAge: 5, //Optional
  origins: ['*'],
  allowHeaders: ['API-Token'],
  exposeHeaders: ['API-Token-Expiry']
});

 
server.pre(cors.preflight);
server.use(cors.actual);

server.listen(3000, function() {
    console.log('%s rodando em %s', server.name, server.url);
});


//rotas-------------^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//lista todos dados da tabela cervejas
server.get('/getallceva', (req, res, next) => {
    knex('cervejas').then(dados => {
        res.send(dados);
    }, next);
});

//adiciona um dado na tabela cervejas
server.post('/create', (req, res, next) => {
    knex('cervejas').insert(req.body).then(dados => { // se tudo der certo knex retorna o ID do item
        res.send(dados);
    }, next);
});


//Edita um dado na tabela cervejas
server.put('/update/:id', (req, res, next) => {
    const { id } = req.params;
    knex('cervejas')
        .where('id', id)
        .update(req.body)
        .then(dados => { // retorna 0 se ocorrer algum erro e 1 se der tudo certo
            if (dados == 0) {
                return res.send(new errs.BadRequestError('Nada foi encontrado'));
            }

            res.send('Dados Atualizados');
        }, next);
});


//Deletado um dado 
server.del('/del/:id', (req, res, next) => {
    const { id } = req.params;
    knex('cervejas')
        .where('id', id)
        .delete()
        .then(dados => { // retorna 0 se ocorrer algum erro e 1 se der tudo certo
            if (dados == 0) {
                return res.send(new errs.BadRequestError('Nada foi encontrado'));
            }

            res.send('Dados Excluidos');
        }, next);
});


//procura uma cerveja
server.get('/get/:id', (req, res, next) => {
    const { id } = req.params;
    knex('cervejas')
        .where('id', id)
        .first()
        .then(dados => {
            if (dados == null) {
                return res.send(new errs.BadRequestError('Nada foi encontrado'));
            }
            res.send(dados);
        }, next);
});
//-----------------------------------------------------------------------------------

//procura um usuario
server.get('/getusuario/:email', (req, res, next) => {
    const { email } = req.params;
    knex('usuarios').where('email', email)
        .first()
        .then(dados => {
            if (dados == null) {
                return res.send(new errs.BadRequestError('Nada foi encontrado'));
            }
            res.send(dados);
        }, next);
});

//adiciona um usuario
server.post('/novousuario', (req, res, next) => {
    knex('usuarios').insert(req.body).then(dados => { // se tudo der certo knex retorna o ID do item
        res.send(dados);
    }, next);
});

//----------------------------------------------------------------------------------------
//adiciona pedido
server.post('/novopedido', (req, res, next) => {
    knex('pedidos').insert(req.body).then(dados => { // se tudo der certo knex retorna o ID do item
        res.send(dados);
    }, next);
});

//procura pedidos
server.get('/getpedidousuario/:id_usuario', (req, res, next) => {
    const { id_usuario } = req.params;
    knex.from('pedidos')
        .innerJoin('usuarios', 'pedidos.id_usuario', 'usuarios.id')
        .where('id_usuario', id_usuario)
        .first()
        .then(dados => {
            if (dados == null) {
                return res.send(new errs.BadRequestError('Nada foi encontrado'));
            }
            res.send(dados);
        }, next);    
});