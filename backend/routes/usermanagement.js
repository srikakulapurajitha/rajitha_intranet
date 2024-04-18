import expres from 'express'
import { adduser, edituser, getaccessdata,  getemployeeid, getuser, updateuseraccess } from '../controllers/usermanagement.js'



const route = expres.Router()

route.get('/getemployeeid',getemployeeid)
route.get('/getuser',getuser)
route.post('/adduser',adduser)
route.put('/edituser',edituser)

//user acceess management

route.post('/getaccessdata', getaccessdata)
route.post('/updateuseraccess', updateuseraccess)

export default route