import expres from 'express'
import {companynames,addcompanypageholidays,viewcompanypages,getcompanypagedata, updatecompanypageholidays, deletecompanypages, addcompanypageaddress, updatecompanypageaddress
} from '../controllers/companypagemanagement.js'
const route = expres.Router()

route.get('/companynames', companynames)
route.get('/viewcompanypages', viewcompanypages)
route.post('/addcompanypageholidays',addcompanypageholidays)
route.post('/addcompanypageaddress',addcompanypageaddress)
route.post('/getcompanypagedata',getcompanypagedata)
route.post('/deletecompanypages',deletecompanypages)
route.put('/updatecompanypageholidays',updatecompanypageholidays)
route.put('/updatecompanypageaddress',updatecompanypageaddress)


export default route