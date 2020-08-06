import {Request, Response} from 'express'

import db from '../database/connection';
import convertHourToMinutes from '../utils/convertHourToMinutes';

interface ScheduleItem {
    week_day: number;
    from: string;
    to: string;
}

export default class ClassesController {
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
    
      const insertedUseresIds = await db('users').insert({
           name,
           avatar,
           whatsapp,
           bio,
       });
    
       const user_id = insertedUseresIds[0];
    
       const insertedClassesIds = await db('classes').insert({
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
    
       await db('class_schedule').insert(classSchedule);
    
       return response.send();
    }async (request, response) => {
    const {
        name, 
        avatar,
        whatsapp,
        bio,
        subject,
        cost,
        schedule
    } = request.body;

  const insertedUseresIds = await db('users').insert({
       name,
       avatar,
       whatsapp,
       bio,
   });

   const user_id = insertedUseresIds[0];

   const insertedClassesIds = await db('classes').insert({
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

   await db('class_schedule').insert(classSchedule);

   return response.send();
}
}