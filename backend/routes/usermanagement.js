import expres from 'express'
import { adduser, edituser, getemployeeid, getuser } from '../controllers/usermanagement.js'



const route = expres.Router()

route.get('/getemployeeid',getemployeeid)
route.get('/getuser',getuser)
route.post('/adduser',adduser)
route.put('/edituser',edituser)

export default route