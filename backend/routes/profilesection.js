import express from 'express'
import { addcontactinformation, getcontactinformation, updatepersonalinfo } from '../controllers/profilesection.js'


const route = express.Router()

route.post('/updatepersonalinfo', updatepersonalinfo)
route.post('/getcontactinformation',getcontactinformation)
route.post('/addcontactinformation',addcontactinformation)

export default route