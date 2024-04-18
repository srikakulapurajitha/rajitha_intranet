import express from 'express'
import { deletegeneratedattendance, generateattendance, generatedmonthattendance, getemployeedata, managedepartmentsleaves, manageleaves, monthattendance, monthbalance, viewgeneratedattendance } from '../controllers/balanceleaves.js'


const route = express.Router()

route.post('/monthattendance',monthattendance)
route.post('/monthbalance',monthbalance)

route.get('/getemployeedata',getemployeedata)
route.post('/manageleaves',manageleaves)
route.post('/managedepartmentsleaves',managedepartmentsleaves)

route.post('/generateattendance',generateattendance)
route.post('/viewgeneratedattendance', viewgeneratedattendance)
route.put('/deletegeneratedattendance', deletegeneratedattendance)

route.post ('/generatedmonthattendance', generatedmonthattendance)


export default route