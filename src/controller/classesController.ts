import {Request, Response} from 'express'

import db from '../database/connection';
import convertHourToMinutes from '../utils/convertHourToMinutes';

//Declarando que os dados recebidos são do tipo string e number.
interface ScheduleItem {
    week_day: number;
    from: string;
    to: string;
}

//Rotas de cadastro de dados e busca de dados.
export default class ClassesController {
    //Filtragem
    async index(request: Request, response: Response) {
        const filters = request.query;

        //Declarando que os dados recebidos são do tipo string
        const subject = filters.subject as string;
        const week_day = filters.week_day as string;
        const time = filters.time as string;

        //Verificação do preenchimento dos campos do filtro.
        if(!filters.week_day || !filters.subject || !filters.time ) {
            return response.status(400).json({
                error: 'Missing filters to search classes.'
            })
        }

        const timeInMinutes = convertHourToMinutes(time);
        //Busca dos itens
        const classes = await db('classes')
            //Verificação do horário e do dia da semana.
            .whereExists(function() {
                this.select('class_schedule.*')
                .from('class_schedule')
                .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
                .whereRaw('`class_schedule`.`week_day` = ??',[Number(week_day)])
                .whereRaw('`class_schedule`.`from` <= ??',[timeInMinutes])
                .whereRaw('`class_schedule`.`to` > ??',[timeInMinutes]);

            })
            //Busca do campo da matéria
            .where('classes.subject', '=', subject)
            .join('users', 'classes.user_id', '=' , 'users.id')
            .select(['classes.*', 'users.*']);

        return response.json(classes);
    }

    //Cadastro de dados
    async create(request: Request, response: Response) {
        const {
            name, 
            avatar,
            whatsapp,
            bio,
            subject,
            cost,
            schedule
        } = request.body;
    
        const trx = await db.transaction();
    
       try {
        const insertedUseresIds = await trx('users').insert({
            name,
            avatar,
            whatsapp,
            bio,
        });
    
        const user_id = insertedUseresIds[0];
    
        const insertedClassesIds = await trx('classes').insert({
            subject,
            cost,
            user_id,
        });
    
        const class_id = insertedClassesIds[0];
    
        const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
            return {
                class_id,
                week_day: scheduleItem.week_day,
                from: convertHourToMinutes(scheduleItem.from),
                to: convertHourToMinutes(scheduleItem.to),
            };
        })
    
        await trx('class_schedule').insert(classSchedule);
    
        await trx.commit();
    
        return response.status(201).send();
       } catch (err) {
        await trx.rollback();
    
           return response.status(400).json({
               error: 'Unexpected error while creating new class'
           })
       }
    }
}  