import db from '../config/connectiondb.js'
import {transporter} from '../config/emailconfig.js';
import cloudinary from '../config/cloudinaryconfig.js'
import bcrypt from "bcrypt";
import CryptoJS from"crypto-js"

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
                    try {
                        await db.promise().query(update_query, update_values)
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
