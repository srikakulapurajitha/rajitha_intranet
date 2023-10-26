import expres from 'express'
import { addannouncement, deleteannouncement, updateannouncement, viewannouncement } from '../controllers/announcement.js'


const route = expres.Router()

route.post('/addannouncement',addannouncement)
route.get('/viewannouncement',viewannouncement)
route.put('/updateannouncement',updateannouncement)
route.post('/deleteannouncement', deleteannouncement)


export default route