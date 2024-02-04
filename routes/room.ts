import express from "express";
//@ts-ignore
import { createroom} from '../controller/room'

const router = express.Router();

router.route('/createroom').post(createroom);

module.exports = router;

