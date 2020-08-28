const express = require('express');
const app = express();

const { Sequelize, DataTypes, STRING } = require('sequelize');
const { request } = require('express');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'banco.sqlite'
})

sequelize.authenticate();
const Tarefas = sequelize.define('Tarefa', {
    descricao: {
        type: DataTypes.STRING
    },
    dataCriacao: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    status: {
        type: DataTypes.ENUM,
        values: ['pendente', 'andamento', 'concluida']
    }
})

Tarefas.sync();

app.use(express.json())

// utilizado para consulta
app.get('/tarefas/:id', async function (request, response) {
    const id = request.params.id
    const tarefa = await Tarefas.findByPk(id);
    response.json(tarefa)
});

app.get('/tarefas', async function (request, response) {
    const tarefas = await Tarefas.findAll();
    response.json(tarefas)
});
// utilizado para cadastros
app.post('/tarefas', async function (request, response) {
    const tarefa = await Tarefas.create(request.body);
    response.status(201).json(tarefa)
});
// Utilizado para deletar 
app.delete('/tarefas/:id', async function (request, response) {
    const id = request.params.id
    const tarefa = await Tarefas.findByPk(id);
    await tarefa.destroy();
    response.status(200).json({ mensagem: 'tarefa apagada' });

});
// Utilizado para alteracao de dados
app.put('/tarefas/:id', async function (request, response) {
    const id = request.params.id
    const tarefa = await Tarefas.findByPk(id);
    tarefa.descricao = request.body.descricao;
    tarefa.status = request.body.status;
    await tarefa.save();
    response.json(tarefa)
});

app.listen(3000, function () {
    console.log("teste servidor")
})
