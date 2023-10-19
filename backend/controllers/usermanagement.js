import db from '../config/connectiondb.js'
import transporter from '../config/emailconfig.js';
import cloudinary from '../config/cloudinaryconfig.js'
import bcrypt from "bcrypt";

export const getemployeeid = (req, res) => {
    const q = 'select employee_id from usermanagement order by employee_id desc limit 1'
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

export const adduser = async (req, res) => {
    //console.log(req.body)

    const check_query = 'select * from usermanagement where email=?'
    db.query(check_query, [req.body.email], async (err, check_res) => {
        if (err) return res.status(500).json('error occured!')
        console.log('result', check_res)
        if (check_res.length === 0) {
            let profile_img = req.body.profile

            if (req.body.profile !== '') {
                try {

                    const img_res = await cloudinary.uploader.upload(req.body.profile, { upload_preset: 'wf7ybapf' })
                    console.log(img_res)
                    profile_img = img_res.url


                }
                catch (err) {
                    console.log(err)
                    return res.status(500).json('something went wrong try again!')

                }
            }
            const hashPass = bcrypt.hashSync(req.body.password, 12)
            console.log('hashpass:', hashPass)

            //console.log('compare:',bcrypt.compareSync(`${hashPass}`,12))
            const insert_query = `insert into usermanagement values(?)`
            const insert_values = [profile_img, req.body.firstName, req.body.lastName, req.body.dob, req.body.country, req.body.gender, req.body.bloodGroup, req.body.companyName, req.body.aboutYourself, req.body.employeeId, req.body.access, req.body.dateOfJoining, req.body.status, req.body.email, hashPass, req.body.designation]

            try {
                await db.promise().query(insert_query, [insert_values])
                //-----------mail--------------
                const mailOptions = {
                    from: '"Brightcomgroup" <akashdandge100@gmail.com>', // sender address
                    to: [req.body.email],
                    subject: `Login Credentials`,
                    template: 'UserRegister', // the name of the template file i.e email.handlebars
                    context: {
                        username: `${req.body.firstName} ${req.body.lastName}`,
                        emp_id: `bcg/${req.body.employeeId}`,
                        email: req.body.email,
                        pass: req.body.password
                    }
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        return console.log(error);
                    }
                    //console.log(info)
                    console.log('Message sent: ' + info.response);
                })
                res.send('user added successfully')
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

export const getuser = (req, res) => {
    const user_query = 'select * from usermanagement'
    db.query(user_query, (err, result) => {
        if (err) return res.status(500).json('error occured!')
        else {

            res.send(result)

        }
    })
}

export const edituser = (req, res) => {
    console.log(req.body)
    const { profile_pic, first_name, last_name, date_of_birth, country, gender, blood_group, company_name, about_yourself, employee_id, access, date_of_joining, status, email, password, designation } = req.body
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
                    if (!profile_pic.includes('http://res.cloudinary.com/') && profile_pic !== '') {
                        try {

                            const img_res = await cloudinary.uploader.upload(profile_img, { upload_preset: 'wf7ybapf' })
                            console.log(img_res)
                            profile_img = img_res.url
                            //console.log('working')
                        }
                        catch (err) {
                            console.log(err)
                            return res.status(500).json('something went wrong try again!')
                        }
                    }
                    //res.send('ok')

                    const update_query = 'update usermanagement set profile_pic=?,first_name=?, last_name=?, date_of_birth=?,country=?,gender=?,blood_group=?,company_name=?,about_yourself=?,access=?,date_of_joining=?,status=?,email=?,password=?,designation=? where employee_id=?'
                    const update_values = [profile_img, first_name, last_name, date_of_birth, country, gender, blood_group, company_name, about_yourself, access, date_of_joining, status, email, password, designation, employee_id]
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
    //res.send('from edit')
}
