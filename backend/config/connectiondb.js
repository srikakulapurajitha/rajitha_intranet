import mysql from 'mysql2'

// const db = mysql.createConnection({
//     host:'192.168.30.75',
//     user:'user',
//     password:'pass',
//     database:'ecart'   
// })

const db = mysql.createConnection({
    
    user:'root',
    password:'root',
    database:'intranet',
})



export default db
