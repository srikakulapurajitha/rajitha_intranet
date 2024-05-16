import expres from 'express'
import { adduser, docsUploadStorage, edituser, employeedata, getaccessdata,  getemployeeid, getuser, saveemployeedetails, updateuseraccess } from '../controllers/usermanagement.js'



const route = expres.Router()

route.get('/getemployeeid',getemployeeid)
route.get('/getuser',getuser)
route.post('/adduser',adduser)
route.put('/edituser',edituser)

//user acceess management

route.post('/getaccessdata', getaccessdata)
route.post('/updateuseraccess', updateuseraccess)

// employee details

route.post('/employeedata', employeedata)
route.post('/saveemployeedetails',docsUploadStorage.fields([{name:'passport_photo',maxCount:1},{name:'secondary_education_percentage_file',maxCount:1},{name:'higher_secondary_education_percentage_file',maxCount:1},{name:'diploma_file',maxCount:1},{name:'graduation_file',maxCount:1},{name:'post_graduation_file',maxCount:1},{name:'resignation_letter_file',maxCount:1},{name:'appraisal_letter_file',maxCount:1},{name:'past_exp_offer_letter_file',maxCount:1},{name:'payslips_file',maxCount:1},{name:'resume_file',maxCount:1},{name:'offer_letter_file',maxCount:1},{name:'nda_file',maxCount:1}]),saveemployeedetails)

export default route