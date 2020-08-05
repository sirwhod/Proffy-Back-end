import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (request, response) => {
    return response.json({massege: 'Hello World'})
})

//localhost:3333/users
app.listen(3333);