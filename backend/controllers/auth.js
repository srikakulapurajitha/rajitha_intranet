import db from "../config/connectiondb.js"
import transporter from "../config/emailconfig.js";
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt";
import otpGenerator from 'otp-generator'
import 'dotenv/config'

export const login = (req, res) => {
    console.log(req.body)
    //if(bcrypt.compareSync(req.body.password))
    const q = `select * from usermanagement where email=? and status='active'`
    db.query(q, [req.body.email], (err, result) => {
        if (err) return res.status(500).json('error occured!')
        else {
            if (result.length !== 0 && bcrypt.compareSync(req.body.password, result[0].password)) {
                console.log(result)
                result = result[0]
                const token = jwt.sign({ employee_id: result.employee_id, email: result.email, access: result.access }, process.env.JWT_SECRET)
                console.log(token)
                delete result.password
                res.cookie('USERAUTHID', token,{maxAge: 10800000}).status(200).json(result)
            }
            else {
                return res.status(401).json('Invalid email/password!')
            }
        }
    })
}

export const checkuser = async (req, res) => {
    console.log(req.cookies)
    try {
        const verify = jwt.verify(req.cookies.USERAUTHID, process.env.JWT_SECRET)
        console.log(verify)
        const { employee_id, email, access } = verify
        const q = `select * from usermanagement where employee_id=? and email=? and access=? and status='active'`
        db.query(q, [employee_id, email, access], (err, result) => {
            if (err) {
                console.log(err)
                return res.status(500).json('error occured!')
            }
            else {
                if (result.length !== 0) {
                    result = result[0]
                    delete result.password
                    console.log(result)
                    res.status(200).json(result)
                }
                else {
                    return res.clearCookie('USERAUTHID').status(401).json('Unauthorized')
                }

            }
        })
    }
    catch {
        return res.status(401).json('Unauthorized')
    }

}

export const logout = (req,res)=>{
    console.log(req.cookies.USERAUTHID)
    return res.clearCookie('USERAUTHID').status(200).json('Logged Out!')
}

export const forgotpassword =(req,res)=>{
    console.log(req.body)
    const q = `select * from usermanagement where email=? and status='active'`
    db.query(q,[req.body.email],(err,result)=>{
        if(err) return res.status(500).json('error occured!')
        else{
            if(result.length===0){
                return res.status(401).json(`email address doesn't exists!`)
            }
            else{
                
                const otp = otpGenerator.generate(6, {lowerCaseAlphabets:false, upperCaseAlphabets: false, specialChars: false });
                console.log(otp)
                //-----------mail--------------
                const mailOptions = {
                    from: '"Brightcomgroup"<akashdandge100@gmail.com>', // sender address
                    to: [req.body.email],
                    subject: `Reset Password Validation Code`,
                    template: 'ResetPassword', // the name of the template file i.e email.handlebars
                    context: {
                       otp:`${otp}`.split('')
                    }
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        return res.status(500).json('Not able send validation try again after some time!');
                    }
                    //console.log(info)
                    console.log('Message sent: ' + info.response);
                    return res.status(200).json({'otp':otp,'msg':'validation code sended successully'})
                })
                
                
            }
        }
})

}

export const resetpassword = async(req,res)=>{
    console.log(req.body)
    const pass = bcrypt.hashSync(req.body.password,12)
    const q = `update usermanagement set password=? where email=?`
    console.log(pass)
    try{
        await db.promise().query(q,[pass,req.body.email])
        return res.status(200).json('Password reseted successfully')
    }
    catch{
        return res.status(500).json('error occured!')
    }

}





