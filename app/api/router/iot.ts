import express from 'express';
const iotRouter = express.Router();
import { webScrap } from '../controller/iot';

iotRouter.get('/', webScrap);

export default iotRouter;
