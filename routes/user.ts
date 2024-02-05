import express from 'express'
//@ts-ignore
import {createaccess,createsession, createuser} from "../controller/user"


const router = express.Router();


router.route('/login').post(createaccess)
router.route('/sign').post(createuser)
router.route('/session').get(createsession) // solve error in this route

module.exports = router;