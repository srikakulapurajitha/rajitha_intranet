import db from "../config/connectiondb.js"
import {transporter} from "../config/emailconfig.js";
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt";
import otpGenerator from 'otp-generator'
import 'dotenv/config'
import CryptoJS from"crypto-js"
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config'


export const login = (req, res) => {
    console.log(req.body)
    //if(bcrypt.compareSync(req.body.password))
    const q = `select * from usermanagement where email=? and status='active'`
    db.query(q, [req.body.email], (err, result) => {
        if (err) return res.status(500).json('error occured!')
        else {
            if (result.length !== 0 && bcrypt.compareSync(req.body.password, result[0].password)) {
                //console.log(result)
                result = result[0]
                const token = jwt.sign({ employee_id: result.employee_id, email: result.email, user_type: result.user_type, department: result.department }, process.env.JWT_SECRET)
                //console.log(token)
                delete result.password
                //res.cookie('USERAUTHID', token, { maxAge: 10800000 }).status(200).json(result)
                const data = CryptoJS.AES.encrypt(JSON.stringify(result),process.env.DATA_ENCRYPTION_SECRETE).toString()                            
                return res.cookie('USERAUTHID', token).status(200).send(data)
            }
            else {
                return res.status(401).json('Invalid email/password!')
            }
        }
    })
}

export const checkuser = async (req, res) => {
    //console.log(req.cookies)
    const {isAuth,employee_id, email, user_type, department} = req.checkAuth
    try {
        if (isAuth) {
            const q = `select * from usermanagement where employee_id=? and email=? and user_type=? and department=? and status='active'`
            db.query(q, [employee_id, email, user_type, department], (err, result) => {
                if (err) {
                    console.log(err)
                    return res.status(500).json('error occured!')
                }
                else {
                    if (result.length !== 0) {
                        result = result[0]
                        delete result.password
                        console.log(result)
                        const data = CryptoJS.AES.encrypt(JSON.stringify(result),process.env.DATA_ENCRYPTION_SECRETE).toString()
                        return res.status(200).send(data)
                        //res.status(200).json(result)
                    }
                    else {
                        return res.clearCookie('USERAUTHID').status(401).json('Unauthorized')
                    }

                }
            })

        }
        else {
            return res.clearCookie('USERAUTHID').status(401).json('Unauthorized')
        }


    }
    catch {
        return res.status(401).json('Unauthorized')
    }

}

export const logout = (req, res) => {
    console.log(req.cookies.USERAUTHID)
    return res.clearCookie('USERAUTHID').status(200).json('Logged Out!')
}



export const forgotpassword = (req, res) => {
    console.log(req.body)
    const q = `select * from usermanagement where email=? and status='active'`
    db.query(q, [req.body.email], async(err, result) => {
        if (err) return res.status(500).json('error occured!')
        else {
            if (result.length === 0) {
                return res.status(401).json(`email address doesn't exists!`)
            }
            else {

                const otp = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
                const id = uuidv4()
                console.log(otp)
                const insert_otp_query = `insert into userotp values(?)`
                const insert_otp_values = [[id, req.body.email, otp]]

                try{
                    await db.promise().query(insert_otp_query, insert_otp_values)
                    //-----------mail--------------
                    const mailOptions = {
                        from: '"Brightcomgroup"<akashdandge100@gmail.com>', // sender address
                        to: [req.body.email],
                        subject: `Reset Password Validation Code`,
                        template: 'ResetPassword', // the name of the template file i.e email.handlebars
                        context: {
                            otp: `${otp}`.split('')
                        }
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error)
                            return res.status(500).json('Not able send validation try again after some time!');
                        }
                        else {
                            //console.log(info)
                            const data = CryptoJS.AES.encrypt(JSON.stringify({ 'ref': id, 'msg': 'validation code sended successully' }),process.env.DATA_ENCRYPTION_SECRETE).toString()
                            return res.status(200).send(data)

                        }


                        //console.log('Message sent: ' + info.response);

                    })
                }
                catch(err){
                    console.log(err)
                    return res.status(500).json('error occured!')

                }

                
                // const data =CryptoJS.AES.encrypt(JSON.stringify({ 'otp': otp, 'msg': 'validation code sended successully' }),'pass').toString()
                // console.log(data)
                // return res.status(200).json(data)



            }
        }
    })

}

export const verifyotp = (req,res) =>{
    const {email,ref,clientOtp} = req.body

    const verify_otp_query = `select * from userotp where id=? and email=? and otp=?`
    const verify_otp_values = [ref, email, clientOtp]
    db.query(verify_otp_query, verify_otp_values, (err, result)=>{
        if (err) return res.status(500).json('error occured!')
        else{
            if(result.length===0){
                
                return res.status(406).json('Invalid Validation Code')
            }
            else{
                return res.send('Verification Successfull!')
            }
        }
    })

}

export const resetpassword = async (req, res) => {
    console.log(req.body)
    const pass = bcrypt.hashSync(req.body.password, 12)
    const q = `update usermanagement set password=? where email=?`
    //console.log(pass)
    const delete_prev_otp_query =  `delete from userotp where email=?`
    const delete_prev_otp_values = [req.body.email]
    try {
        await db.promise().query(q, [pass, req.body.email])
        await db.promise().query(delete_prev_otp_query, delete_prev_otp_values)
        //console.log('inserted')
        return res.status(200).json('Password reseted successfully')
    }
    catch(err) {
        console.log(err)
        return res.status(500).json('error occured!')
    }

}


export const changepassword = (req, res) => {
    console.log(req.body)
    const { oldPassword, newPassword, confirmNewPassword, email } = req.body

    const check_old_password = `select password from usermanagement where email=? and status='active'`
    db.query(check_old_password, [email], async (err, result) => {
        if (err) return res.status(500).json('error occured!')
        else {
            if (result.length === 0) {
                return res.status(401).json(' Unauthorized User')
            }
            else {
                if (bcrypt.compareSync(oldPassword, result[0].password)) {
                    if (newPassword === confirmNewPassword) {
                        const hash = bcrypt.hashSync(confirmNewPassword, 12)
                        const update_password_query = `update usermanagement set password = ? where email=?`
                        const update_password_values = [hash, email]
                        
                        try {
                            await db.promise().query(update_password_query, update_password_values)
                            
                            return res.status(200).json(`Password updated successfully`)
                        }
                        catch {
                            return res.status(500).json('error occured!')
                        }
                    }
                    else {
                        return res.status(406).json(`new password and confirm password doesn't match!`)
                    }
                }
                else {
                    return res.status(406).json(`Old password doesn't match!`)
                }
            }
        }
    })
}


