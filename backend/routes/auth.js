import expres from 'express'
import { changepassword, checkuser, forgotpassword, login, logout, resetpassword } from '../controllers/auth.js'

const route = expres.Router()

route.post('/login',login)
route.get('/checkuser',checkuser)
route.get('/logout',logout)
route.post('/forgotpasword',forgotpassword)
route.post('/resetpassword',resetpassword)
route.post('/changepassword',changepassword)


export default route