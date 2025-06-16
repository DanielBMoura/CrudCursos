// App:
    express = require('express')
    let app = express()
    app.set('view engine', 'ejs')

// BodyParser
    let bodyParser = require('body-parser')
    app.use(bodyParser.urlencoded({extended: true}))

// dotenv
    require('dotenv').config();

// Conexão com o Banco de dados
    const { Pool } = require('pg');

// Configuração do PostgreSQL (Neon.tech)
    const pool = new Pool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: {
            rejectUnauthorized: process.env.DB_SSL === 'require'
        }
    });

app.get('/', async function(req, res) {
    const { rows } = await pool.query('SELECT * FROM curso');

    res.render('./curso', { dados: rows });
});

app.post('/cursos/salvar', async function(req, res) {
    const { descricao, carga_horaria } = req.body;
        
    await pool.query(
        'INSERT INTO curso (descricao, carga_horaria) VALUES ($1, $2)',
        [descricao, carga_horaria]
    );
    
    res.redirect('/');
});

app.get('/editar/:id', async function(req, res) {
    const { rows } = await pool.query('SELECT * FROM curso WHERE id = $1', [req.params.id]);
        
    res.render('editar', {
        id: rows[0].id,
        descricao: rows[0].descricao,
        carga_horaria: rows[0].carga_horaria
    });
});

app.post('/atualizar/:id', async function(req, res) {
    const { descricao, carga_horaria } = req.body;
    await pool.query(
        'UPDATE curso SET descricao = $1, carga_horaria = $2 WHERE id = $3',
        [descricao, carga_horaria, req.params.id]
    );
    
    res.redirect('/');
});

app.get('/cursos/Deletar/:id', async function(req, res) {
    await pool.query('DELETE FROM curso WHERE id = $1', [req.params.id]);
    
    res.redirect('/');
});

app.listen(process.env.PORT || 3000, function() {
    console.log(`Servidor rodando na porta ${process.env.PORT || 3000}`);
});