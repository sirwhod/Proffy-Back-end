import express from 'express';
import ClassesController from './controller/classesController';
import ConnectionsController from './controller/connectionsController';

const routes = express.Router();
const classesController = new ClassesController();
const connectionsController = new ConnectionsController();

routes.post('/classes', classesController.create);
routes.get('/classes', classesController.index);

routes.get('/connections', connectionsController.index);
routes.post('/connections', connectionsController.create);


    
export default routes;