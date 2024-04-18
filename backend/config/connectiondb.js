import mysql from 'mysql2'
import 'dotenv/config'

// const db = mysql.createConnection({
//     host:'192.168.30.75',
//     user:'user',
//     password:'pass',
//     database:'ecart'   
// })

const db = mysql.createConnection({
    
    user:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    host:process.env.DB_HOST,
    database:process.env.DB_DATABASE,
    
    enableKeepAlive: true,
  keepAliveInitialDelay: 0,

})

// setInterval(()=>{
//     console.log('trying')
//    //`` db.ping()
//     db.connect((err)=>{
//         if (err){
//             console.log(err)
            
//         }
//         else {
//             console.log('connected')
//         }
//     })
    

// },20000)


export default db




// if (req.checkAuth.isAuth && req.checkAuth.user_type === 'admin') {
// }
// else {
//     res.status(406).json('Unauthorized! not allowed to perform action.')
// }
