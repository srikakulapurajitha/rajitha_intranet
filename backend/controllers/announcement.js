import db from "../config/connectiondb.js"

export const addannouncement = (req,res)=>{
    console.log(req.body)
    const {companyId, companyName, title, description, from_date, to_date  } =req.body
    const check_query=`select * from announcement where companyId=? and  title=? and from_date=? and to_date=? `
    const check_values=[companyId,title,from_date,to_date]
    db.query(check_query, check_values,async(err,result)=>{
        if (err) return res.status(500).json('error occured!')
        else{
            if(result.length===0){
                const insert_query = `insert into announcement(company_name,title,description,from_date,to_date,companyId) values(?)`
                const insert_value = [companyName, title, description, from_date, to_date,companyId]
                try{
                    await db.promise().query(insert_query,[insert_value])
                    return res.status(200).json('Announcement added successfully')
                }
                catch{
                    return res.status(500).json('error occured!')
                }
            }
            else{
                return res.status(502).json('Annoucement already exists!')
            }
        }
        //console.log(result)
    })
    //res.send('ok')
}

export const viewannouncement = (req,res) =>{
    const q = `select * from announcement`
    db.query(q,(err,result)=>{
        if(err) return res.status(500).json('error occured!')
        else{
            return res.status(200).json(result)
        }
    })
}

export const updateannouncement = (req,res)=>{
    console.log(req.body)
    const {id,company_name,title,description,from_date, to_date, companyId,} = req.body
    const check_query=`select * from announcement where title=? and from_date=? and to_date=? and companyId=? and id!=? `
    const check_values=[title,from_date, to_date,companyId,id]
    db.query(check_query, check_values,async(err,result)=>{
        if (err){
            console.log(err)
            return res.status(500).json('error occured!')
        } 
        else{
            //console.log(result)
            if(result.length===0){
                const update_query = `update announcement set company_name=?, title=?, description=?, from_date=?, to_date=?, companyId=? where id=?`
                const update_value = [company_name, title, description, from_date, to_date, companyId,id]
                try{
                    await db.promise().query(update_query,update_value)
                    return res.status(200).json('Announcement updated successfully')
                }
                catch(err){
                     console.log(err)
                    return res.status(500).json('error occured!')
                }
            }
            else{
                return res.status(502).json('Annoucement already exists!')
            }
        }
        //console.log(result)
    })


   //res.status(500).json('ok')
}

export const deleteannouncement = async(req,res)=>{
    console.log(req.body)
    const q='delete from announcement where id in (?)'
    try{
        await db.promise().query(q,[req.body.id])
        return res.status(200).json('Announcement Deleted Successfully')
    }
    catch{
        return res.status(500).json('error occured!')
    }
}


//Notice

export const notice =  (req,res) =>{
    console.log(req.body)
    const q = `select * from announcement where company_name =? and to_date>=? order by to_date`
    const values =[req.body.company_name,req.body.date]
    db.query(q,values,(err,result)=>{
        console.log(err)
        console.log('ann',result)
        if(err) res.status(500).json('error occured!')
        else{ 
            return res.status(200).json(result)
        }

    })
    //res.send('ok')
}