import express from 'express'
//@ts-ignore
import {createaccess,createsession} from "../controller/user"


const router = express.Router();


router.route('/login').post(createaccess)
router.route('/session').post(createsession) // solve error in this route

module.exports = router;