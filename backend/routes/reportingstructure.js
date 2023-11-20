import expres from 'express'
import { addreportingstructure, deletereportingstructure, editreportingstructuredata, getreportingheaddata, getreportingstructuredata, getreportinguser, updatereportingstructure } from '../controllers/reportingstructure.js'



const route = expres.Router()

route.post('/getreportinguser',getreportinguser)
route.post('/addreportingstructure',addreportingstructure)
route.get('/getreportingheaddata',getreportingheaddata)
route.get('/getreportingstructuredata',getreportingstructuredata)
route.post('/editreportingstructuredata',editreportingstructuredata)
route.post('/updatereportingstructure',updatereportingstructure)
route.post('/deletereportingstructure',deletereportingstructure)



export default route