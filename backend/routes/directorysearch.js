import express from 'express'
import { getuserdetails, serachUser } from '../controllers/directorysearch.js'


const route = express.Router()

route.post('/searchuser',serachUser)
route.post('/getuserdetails',getuserdetails)


export default route