import db from "../config/connectiondb.js";
import transporter from "../config/emailconfig.js";
import 'dotenv/config'

export const birthdaylist  = (req,res)=>{
    const q = `select profile_pic,first_name,last_name,date_of_birth,email,employee_id,company_name,country from usermanagement where status='active' order by dayofmonth(date_of_birth)`
    db.query(q,(err,result)=>{
        if(err) return res.status(500).json('error occured!')
        else{
            console.log(result)
            return res.status(200).json(result)
        } 
    })
}

export const sendbirthdaywishes = (req,res)=>{
    console.log(req.body)
    const {to,name,from,subject,msg} = req.body

    const mailOptions={
        from:`"${name}" <${from}`,
        to:[`${to}`],
        subject:subject,
        template:'BirthdayGreeting',
        context:{
            message:`${msg}`,
            from:name
        }
    }

    transporter.sendMail(mailOptions,(err,info)=>{
        if(err){
            console.log(err)
            return res.status(500).json('Not able send birthday wishes!')
        } 
        else return res.status(200).json('Birthday wishes sended successfully')
    })


    //res.send('ok')
}