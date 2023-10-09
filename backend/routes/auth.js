import expres from 'express'
import { login } from '../controllers/auth.js'

const route = expres.Router()

route.post('/login',login)



export default route