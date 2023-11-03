import expres from 'express'
import { birthdaylist, sendbirthdaywishes } from '../controllers/userdata.js'


const route = expres.Router()

route.get('/birthdaylist',birthdaylist)
route.post('/sendbirthdaywishes',sendbirthdaywishes)


export default route