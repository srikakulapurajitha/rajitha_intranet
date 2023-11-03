import expres from 'express'
import { holidaylist } from '../controllers/officecalender.js'

const route = expres.Router()

route.get('/holidaylist',holidaylist)


export default route