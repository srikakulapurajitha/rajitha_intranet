import expres from 'express'
import { holidaylist } from '../controllers/officecalender.js'

const route = expres.Router()

route.post('/holidaylist',holidaylist)


export default route