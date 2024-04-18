import expres from 'express'
import { addreportingstructure, deletereportingstructure, editreportingstructuredata, getreportingheaddata, getreportingstructuredata, getreportinguser, reportingusers, updatereportingstructure } from '../controllers/reportingstructure.js'



const route = expres.Router()

route.post('/getreportinguser',getreportinguser)
route.post('/addreportingstructure',addreportingstructure)
route.get('/getreportingheaddata',getreportingheaddata)

route.post('/editreportingstructuredata',editreportingstructuredata)
route.post('/updatereportingstructure',updatereportingstructure)
route.post('/deletereportingstructure',deletereportingstructure)

//-------------------------view reporting structure-------------------------------
route.post('/reportingusers', reportingusers)
route.post('/getreportingstructuredata',getreportingstructuredata)



export default route