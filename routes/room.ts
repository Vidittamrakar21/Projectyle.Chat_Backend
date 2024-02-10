import express from "express";
//@ts-ignore
import { createroom ,findroom} from '../controller/room'

const router = express.Router();

router.route('/createroom').post(createroom);
router.route('/findroom').post(findroom);

module.exports = router;

