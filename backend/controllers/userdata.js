import db from "../config/connectiondb.js";
import transporter from "../config/emailconfig.js";
import 'dotenv/config'

export const birthdaylist  = (req,res)=>{
    const q = `select profile_pic,first_name,last_name,date_of_birth,email from usermanagement where status='active'`
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
    const {to,from,msg} = req.body

    const mailOptions={
        from:`"Brightcomgroup" <${process.env.GMAIL}`,
        to:[`${to}`],
        subject:`Happy Birthday`,
        template:'BirthdayGreeting',
        context:{
            message:`${msg}`,
            from:from
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