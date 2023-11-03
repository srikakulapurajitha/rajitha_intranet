import express from 'express'
import { UploadFile, attendance, attendancegraphdata, filterattendance, filteruserattendance, uploadStorage, viewattendance } from '../controllers/attendance.js'
import { notice } from '../controllers/announcement.js'
const route = express.Router()

route.post('/uploadattendance', uploadStorage.array('file'), UploadFile)
route.get('/viewattendance',viewattendance)
route.post('/filterattendance',filterattendance)
route.post('/attendance',attendance)
route.post('/filteruserattendance',filteruserattendance)
route.post('/attendancegraphdata',attendancegraphdata)

route.post('/notice',notice)

export default route