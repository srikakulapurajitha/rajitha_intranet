import expres from 'express'
import { addnewpromotion, deletepromotion, getuserexperience, modifypromotion } from '../controllers/userexperince.js'

const route = expres.Router()

route.post('/getuserexperience', getuserexperience)
route.post('/addnewpromotion',addnewpromotion)
route.post('/modifypromotion',modifypromotion)
route.post('/deletepromotion',deletepromotion)

export default route