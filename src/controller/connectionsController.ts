import {Request, Response} from 'express';
import db from '../database/connection';


//Rotas de total de conexões e criar nova conexão.
export default class ConnectionsController {
//Rota de total de conexões.

    async index(request: Request, response: Response) {
        const totalConnections = await db('connections').count('* as total');
        
        const { total } = totalConnections[0];
        
        return response.json({ total });
    }
//Rota de criar nova conexão.

    async create(request: Request, response: Response) {
        const { user_id } = request.body;

        await db('connections').insert({
            user_id
        });

        return response.status(201).send();
    }
}