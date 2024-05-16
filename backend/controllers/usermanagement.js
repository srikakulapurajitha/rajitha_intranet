import db from '../config/connectiondb.js'
import {transporter} from '../config/emailconfig.js';
import cloudinary from '../config/cloudinaryconfig.js'
import bcrypt from "bcrypt";
import CryptoJS from"crypto-js"
import multer from "multer"
import path from "path";
import fs from "fs"

const docs_storege = multer.diskStorage({
    destination: function (req, file, cb) {
        
       
        const fields = JSON.parse(req.body.fields)
        console.log('body', fields.emp_id)
        const folder_path = `public/Employee_Documents/${fields.emp_id}/`

        if (!fs.existsSync(path)) {
            fs.mkdirSync(folder_path, { recursive: true });
            cb(null, folder_path)
        }
    },
    filename: function (req, file, cb) {
        //console.log(file.originalname)

        cb(null, 'file'+ '_' + Date.now() + path.extname(file.originalname))
    },
})

export const docsUploadStorage = multer({ storage: docs_storege })


export const getemployeeid = (req, res) => {
    const q = 'select employee_id from usermanagement order by employee_id desc limit 1'
    if (req.checkAuth.isAuth && req.checkAuth.user_type === 'admin') {
        db.query(q, (err, result) => {
            if (err) return res.status(500).json('error occured!')
            else {
                console.log(result)
                if (result.length === 0) {
                    return res.status(200).json({ employee_id: 1 })
                }
                else {
                    return res.status(200).json({ employee_id: result[0].employee_id + 1 })
                }

            }
        })
    }
    else {
        res.status(406).json('unauthorized')
    }

}

export const adduser = async (req, res) => {
    //console.log(req.body)
    if (req.checkAuth.isAuth && req.checkAuth.user_type === 'admin') {
        const { profile, firstName, lastName, dob, country, gender, bloodGroup, companyName, aboutYourself, employeeId, dateOfJoining, userType, department, shift, status, email, password, pastExpDomain, pastExpYears, designation } = req.body
        const check_query = 'select * from usermanagement where email=?'
        db.query(check_query, [email], async (err, check_res) => {
            if (err) return res.status(500).json('error occured!')
            console.log('result', check_res)
            if (check_res.length === 0) {
                let profile_pic = profile

                if (profile !== '') {
                    try {

                        const img_res = await cloudinary.uploader.upload(profile, { upload_preset: process.env.UPLOAD_PRESET_PROFILE_IMG })
                        console.log(img_res)
                        profile_pic = img_res.url


                    }
                    catch (err) {
                        console.log(err)
                        return res.status(500).json('something went wrong try again!')

                    }
                }
                const hashPass = bcrypt.hashSync(password, 12)
                console.log('hashpass:', hashPass)

                //console.log('compare:',bcrypt.compareSync(`${hashPass}`,12))
                const insert_query = `insert into usermanagement values(?)`
                const insert_values = [profile_pic, firstName, lastName, dob, country, gender, bloodGroup, companyName, aboutYourself, employeeId, dateOfJoining, userType, department, shift, status, email, hashPass, pastExpDomain, pastExpYears, designation]

                try {
                    await db.promise().query(insert_query, [insert_values])
                    //-----------mail--------------
                    const mailOptions = {
                        from: '"Brightcomgroup" <akashdandge100@gmail.com>', // sender address
                        to: [email],
                        subject: `Login Credentials`,
                        template: 'UserRegister', // the name of the template file i.e email.handlebars
                        context: {
                            username: `${firstName} ${lastName}`,
                            emp_id: `bcg/${employeeId}`,
                            email: email,
                            pass: password
                        }
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            return console.log(error);
                        }
                        //console.log(info)
                        console.log('Message sent: ' + info.response);
                    })
                    return res.send('user added successfully')
                }
                catch (err) {
                    console.log(err)
                    if (err.errno === 1062) {
                        return res.status(500).json('email already exists!')
                    }
                    else {
                        return res.status(500).json('error occured!')
                    }
                }
            }
            else {
                return res.status(500).json('email already exists!')
            }
        })
    }
    else {
        res.status(406).json('unauthorized')
    }




}

export const getuser = (req, res) => {
    const user_query = 'select * from usermanagement'
    if (req.checkAuth.isAuth && req.checkAuth.user_type === 'admin') {
        db.query(user_query, (err, result) => {
            if (err) return res.status(500).json('error occured!')
            else {

                res.send(result)

            }
        })
    }
    else {
        res.status(406).json('unauthorized')
    }

}

export const edituser = (req, res) => {
    console.log(req.body)
    if (req.checkAuth.isAuth && req.checkAuth.user_type === 'admin') {
        const { profile_pic, first_name, last_name, date_of_birth, country, gender, blood_group, company_name, about_yourself, employee_id, date_of_joining, user_type, department, shift, status, email,  past_exp_domain, past_exp_years, designation, prevProfilePic } = req.body
    const check_query = 'select * from usermanagement where email = ? and employee_id != ?'
    db.query(check_query, [email, employee_id], async (err, check_res) => {
        if (err) {
            console.log(err)
            return res.status(500).json('error occured!')
        }
        else {
            console.log(check_res)
            if (check_res.length === 0) {
                try {
                    let profile_img = profile_pic;
                    if (profile_pic !== '' && prevProfilePic !== profile_pic) {
                        try {
                            const url = prevProfilePic.slice(0, prevProfilePic.lastIndexOf('/'))
                            const img_name = prevProfilePic.slice(prevProfilePic.lastIndexOf('/'), prevProfilePic.lastIndexOf('.'))
                            const path = url.slice(url.lastIndexOf('/') + 1,) + img_name
                            await cloudinary.uploader.destroy(path)
                            const img_res = await cloudinary.uploader.upload(profile_img, { upload_preset: process.env.UPLOAD_PRESET_PROFILE_IMG })
                            //console.log(img_res)
                            profile_img = img_res.url
                            //console.log('working')
                        }
                        catch (err) {
                            console.log(err)
                            return res.status(500).json('something went wrong try again!')
                        }
                    }
                    //res.send('ok')

                    const update_query = 'update usermanagement set profile_pic=?,first_name=?, last_name=?, date_of_birth=?,country=?,gender=?,blood_group=?,company_name=?,about_yourself=?,user_type=?,date_of_joining=?,shift=?, department=?, status=?,email=?,past_exp_domain=?,past_exp_years=?, designation=? where employee_id=?'
                    const update_values = [profile_img, first_name, last_name, date_of_birth, country, gender, blood_group, company_name, about_yourself, user_type, date_of_joining,shift, department, status, email,past_exp_domain,past_exp_years, designation, employee_id]
                    const update_employeedetails_query = `update employeedetails set designation = ?, date_of_joining=?, user_type=?, department=?, company_name=?, first_name=?, last_name=?, gender=?, date_of_birth=?,age=?,blood_group=?,office_email=?,country=?,past_exp_years=?,past_exp_domain=? where emp_id=?`
                    const update_employeedetails_values = [designation, date_of_joining, user_type, department, company_name, first_name, last_name, gender, date_of_birth, new Date().getFullYear()- new Date(date_of_birth).getFullYear(), blood_group, email, country, past_exp_years, past_exp_domain, employee_id]
                    
                    try {
                        await db.promise().query(update_query, update_values)
                        await db.promise().query(update_employeedetails_query, update_employeedetails_values)
                        return res.status(201).json('user data updated successfully')
                    }
                    catch (err) {
                        console.log(err)
                        return res.status(500).json('error occured!')
                    }
                }
                catch {
                    return res.status(500).json('error occured')
                }

            }
            else {
                return res.status(500).json('email already exists!')
            }
        }
    })
    }
    else{
        return res.status(406).json(`Unauthorized! can't able to perform action`)
    }
    
    //res.send('from edit')
}

//user acceess management
export const getaccessdata = (req,res) =>{
    
    if (req.checkAuth.isAuth) {
        const {emp_id} = req.body
        console.log(req.body)
        const fetch_user_access_data_query = `select * from useraccessmanagement where emp_id = ? `
        db.query(fetch_user_access_data_query, [emp_id],(err, result) => {
            if (err) return res.status(500).json('error occured!')
            else {
                const data = CryptoJS.AES.encrypt(JSON.stringify(result),process.env.DATA_ENCRYPTION_SECRETE).toString()
                return res.status(200).send(data)

            }
        })
    }
    else {
        return res.status(406).json(`Unauthorized! can't able to perform action`)
    }

}

export const updateuseraccess = (req,res) =>{
    console.log(req.body)
    if (req.checkAuth.isAuth && req.checkAuth.user_type === 'admin') {
        const {emp_id, pagesToBeAccessed} = req.body
        const fetch_user_access_data_query = `select * from useraccessmanagement where emp_id = ? `
        db.query(fetch_user_access_data_query, [emp_id],async(err, result) => {
            if (err) return res.status(500).json('error occured!')
            else {
                const pages = pagesToBeAccessed.join(',')
                try{
                    if(result.length===0){
                        const insert_access_query = `insert into useraccessmanagement values(?)`
                        const insert_access_values = [[emp_id,pages]]
                        await db.promise().query(insert_access_query, insert_access_values)
                    }
                    else{
                        const update_access_query = `update useraccessmanagement set restricted_pages=? where emp_id=?`
                        const update_access_values = [pages, emp_id]
                        await db.promise().query(update_access_query, update_access_values)
                    }
                    return res.status(201).json('Access Updated Successfully')

                }
                catch{
                    return res.status(500).json('error occured!')
                }
                
            }
        })
    }
    else {
        return res.status(406).json(`Unauthorized! can't able to perform action`)
    }
    
    // res.send('ok')
}


export const employeedata = async(req,res) =>{
    if (req.checkAuth.isAuth && req.checkAuth.user_type === 'admin') {
        try{
            const {emp_id} = req.body
            
            const get_employee_details_query =  `select * from employeedetails  where emp_id=?`
            const get_employee_details_result = await db.promise().query(get_employee_details_query,[emp_id])            
            const details = get_employee_details_result[0]
            if(details.length===0){
                const get_user_data_query =  `select * from usermanagement where employee_id=?`
                const get_user_data_result = await db.promise().query(get_user_data_query,[emp_id])                
                const data = get_user_data_result[0]
                if(data.length!==0 ){
                    const {designation,employee_id, date_of_joining, user_type, department, company_name, first_name, last_name, gender, date_of_birth, blood_group, email, country, past_exp_years, past_exp_domain} = data[0]
                    const dob = new Date(date_of_birth)
                    const today = new Date()
                    const insert_employee_data_query = `insert into employeedetails values(?)`
                    const insert_employee_data_values = [['', designation, employee_id, date_of_joining, user_type, department, company_name, first_name,'', last_name, gender, date_of_birth,today.getFullYear()-dob.getFullYear(),'', blood_group,'' ,'',0,email,'','','','','','',country,'','','','','','','','',0,'',0,'','',0,'','',0,'','',0,'',past_exp_years,past_exp_domain,'','','','','','','','']]
                    await  db.promise().query(insert_employee_data_query, insert_employee_data_values )
                    const get_user_data_query =  `select * from employeedetails where emp_id=?`
                    const get_user_data_result = await db.promise().query(get_user_data_query,[emp_id])
                    const result = get_user_data_result[0]
                    const encryptData = CryptoJS.AES.encrypt(JSON.stringify(result),process.env.DATA_ENCRYPTION_SECRETE).toString()
                    return res.send(encryptData)
                }


            }
            else{
                const encryptData = CryptoJS.AES.encrypt(JSON.stringify(details),process.env.DATA_ENCRYPTION_SECRETE).toString()
                return res.send(encryptData)

            }

        }
        catch(err){
            console.log(err)
            return res.status(500).json('error occured!')
            
        }
        
    }
    else {
        return res.status(406).json(`Unauthorized! can't able to perform action`)
    }

}


export const saveemployeedetails = async(req,res)=>{
    //console.log('file',req.files)
    if (req.checkAuth.isAuth && req.checkAuth.user_type === 'admin') {
        const files = req.files
        const new_files = Object.keys(files)
        const prev_fields = JSON.parse(req.body.prev_fields)
        const prev_updated_files = new_files.map(file=>prev_fields[file])

        
       
        const uploads_files_path = new_files.map(file=>({[file]:(files[file][0].path).slice((files[file][0].path).indexOf('\\'))}))
        console.log(uploads_files_path,prev_updated_files)
        const new_fields = JSON.parse(req.body.fields)
        const {emp_id, first_name, middle_name, last_name, gender, date_of_birth, age, marital_status, blood_group, nationality, spouse_name, number_of_childrens, personal_email, mobile_number, permanent_address, zip_code, city, state, country, account_number, bank_name, bank_branch, ifsc_code, aaddhar_number, pan_number, uan, esi, secondary_education_percentage, higher_secondary_education_percentage, diploma_stream, diploma_percentage,graduation_stream, graduation_percentage, post_graduation_stream, post_graduation_percentage, past_exp_years, past_exp_domain, past_exp_designation} = new_fields

        const prev_file_checks = {passport_photo:prev_fields.passport_photo, secondary_education_percentage_file: prev_fields.secondary_education_percentage_file, higher_secondary_education_percentage_file: prev_fields.higher_secondary_education_percentage_file, diploma_file: prev_fields.diploma_file,  graduation_file: prev_fields.graduation_file, post_graduation_file:prev_fields.post_graduation_file,resignation_letter_file: prev_fields.resignation_letter_file, appraisal_letter_file:prev_fields.appraisal_letter_file, past_exp_offer_letter_file: prev_fields.past_exp_offer_letter_file, payslips_file: prev_fields.payslips_file, resume_file:prev_fields.resume_file, offer_letter_file: prev_fields.offer_letter_file, nda_file:prev_fields.nda_file}
        const prev_file_changed = Object.keys(prev_file_checks).filter(file=>prev_file_checks[file]!==''&& prev_file_checks[file]!== new_fields[file] && new_fields[file]==='')
        //console.log('prev_changed', prev_file_changed, nda_file, prev_fields.nda_file)
        



        try{
            const update_fields_query = `update employeedetails set first_name = ?, middle_name = ?, last_name = ?, gender = ?, date_of_birth = ?, age = ?, marital_status = ?, blood_group = ?, nationality = ?, spouse_name = ?, number_of_childrens = ?,  personal_email = ?, mobile_number = ?, permanent_address = ?, zip_code = ?, city = ?, state = ?, country = ?, account_number = ?, bank_name = ?, bank_branch = ?, ifsc_code = ?, aaddhar_number = ?, pan_number = ?, uan = ?, esi = ?, secondary_education_percentage = ?, higher_secondary_education_percentage = ?, diploma_stream = ?, diploma_percentage = ?,graduation_stream = ?, graduation_percentage = ?, post_graduation_stream = ?, post_graduation_percentage = ?, past_exp_years = ?, past_exp_domain = ?, past_exp_designation = ? where emp_id=?`
            const update_fields_values = [first_name, middle_name, last_name, gender, date_of_birth, age, marital_status, blood_group, nationality, spouse_name, number_of_childrens, personal_email, mobile_number, permanent_address, zip_code, city, state, country, account_number, bank_name, bank_branch, ifsc_code, aaddhar_number, pan_number, uan, esi, secondary_education_percentage, higher_secondary_education_percentage, diploma_stream, diploma_percentage,graduation_stream, graduation_percentage, post_graduation_stream, post_graduation_percentage, past_exp_years, past_exp_domain, past_exp_designation,emp_id]
            const update_fields_usermanagement_query = `update usermanagement set first_name=?, last_name=?, date_of_birth=?,country=?,gender=?,blood_group=?, past_exp_years=?,past_exp_domain=? where employee_id=?`
            const update_fields_usermanagement_values = [first_name, last_name, date_of_birth, country, gender, blood_group, past_exp_years, past_exp_domain, emp_id ]
            await db.promise().query(update_fields_query,update_fields_values)
            await db.promise().query(update_fields_usermanagement_query, update_fields_usermanagement_values)

            if(new_files.length!==0){
                const update_filepath_query = `update employeedetails set ${new_files.map(field_name=>`${field_name} = ?`).join(',')} where emp_id=? `
                const update_filepath_values = (uploads_files_path.map(path=>Object.values(path)).flat())
                console.log('values', [...update_filepath_values, emp_id])
                await db.promise().query(update_filepath_query, [...update_filepath_values, emp_id])
                    prev_updated_files.forEach(file => {
                        if(file!==''){
                            fs.rmSync('public' + file, { force: true })
                        }
                        
                    })
                                 
            }
            if(prev_file_changed.length!==0){
                const update_filepath_query = `update employeedetails set ${prev_file_changed.map(field_name=>`${field_name} = ?`).join(',')} where emp_id=? `
                const update_filepath_values = prev_file_changed.map(file=>new_fields[file])
                console.log('values',update_filepath_query, [...update_filepath_values, emp_id])
                await db.promise().query(update_filepath_query, [...update_filepath_values, emp_id])
                prev_file_changed.map(field=>prev_fields[field]).forEach(file => {
                        console.log('public'+file)
                        if(file!==''){
                            fs.rmSync('public' + file, { force: true })
                        }
                        
                    })

            }
            return res.send('Employee Details Saved Successfully')



        }
        catch(err){
            console.log(err)
            return res.status(500).json('error occured!')

        }

    }

    else {
        return res.status(406).json(`Unauthorized! can't able to perform action`)
    }
    
   

}
