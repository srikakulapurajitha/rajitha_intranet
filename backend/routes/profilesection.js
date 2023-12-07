import express from 'express'
import { addcontactinformation, addfamilyinformation, addfuninformation, addtimezoneinformation, getcontactinformation, getfamilyinformation, getfuninformation, gettimezoneinformation, updatepersonalinfo } from '../controllers/profilesection.js'


const route = express.Router()

route.post('/updatepersonalinfo', updatepersonalinfo)
route.post('/getcontactinformation',getcontactinformation)
route.post('/addcontactinformation',addcontactinformation)
route.post('/getfamilyinformation',getfamilyinformation)
route.post('/addfamilyinformation', addfamilyinformation)
route.post('/getfuninformation',getfuninformation)
route.post('/addfuninformation', addfuninformation)
route.post('/gettimezoneinformation',gettimezoneinformation)
route.post('/addtimezoneinformation', addtimezoneinformation)


export default route