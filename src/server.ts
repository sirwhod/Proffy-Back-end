import express from 'express';

const app = express();

//Rota = Endereço da aplicação
// exemplo:
//http://localhost:3333/users
//http://localhost:3333/contatos

// Recurso = é nome no final da rota.
// nos exemplos anteriores é: "users" e "contatos"

//Metodos Http

//GET = Buscar ou listar alguma informação
//POST = Criar uma nova informação
//PUT = Alterar uma informação existente
//DELETE = deletar uma informação existente.

app.get('/users', (request, response) => {
    const users = [
        {name: 'rodrigo', age: '21'},
        {name: 'felipe', age: '21'}
    ]
    return response.json(users)
})



//localhost:3333/users
app.listen(3333);