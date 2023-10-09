import db from "../config/connectiondb.js"
import jwt from 'jsonwebtoken'


export const login = (req,res)=>{
    const values= [req.body.username, req.body.password]
    console.log(values)
    const q = `select * from users where username=? and password=?`
    db.query(q,values,(err,result)=>{
        if (err) throw err
        console.log(result[0].id)
        if (result.length === 0){
            res.status(500).json('invalid user')
        }
        else{
            
            //res.status(200).json('login successfull')
            const token = jwt.sign({id:result[0].id}, 'bcg')
            console.log(token)
            res.cookie('user',token,{httpOnly:true}).status(200).json('login succefull')
        }
    })
}