import db from "../config/connectiondb.js"
import { v4 as uuidv4 } from 'uuid';

export const addcompany = (req,res)=>{
    console.log(req.body)
    const companyId = uuidv4()
    const values=[companyId,req.body.companyName,req.body.companyEmail,req.body.companyAddress,req.body.companyContactNo,req.body.companyStatus]

    db.query('select * from companymanagement where company_name=?',req.body.companyName,(err,result)=>{
        console.log('res',result)
        if (err){
            console.log(err)
            res.status(500).json('error occured try again!')
        }
        else{
            if (result.length===0){
                
                const q='insert into companymanagement values(?)'
                db.query(q,[values],(err,result)=>{
                    if (err){
                        if(err.errno===1062){
                        console.log(err)
                        res.status(406).json('company name already exist!')
                        }
                        else{
                            res.status(500).json('error occured try again!')
                        }
                    }
                    res.status(200).json('company added successfully')
                })

            }
            else{
                res.status(406).json('company name already exist!')
            }
        }
        
    })
    
    //res.status(200).json('compnay name already exist')

}

export const viewcompany = (req,res)=>{
    const q='select * from companymanagement'
    db.query(q,(err,result)=>{
        if (err){
            //console.log(err)
            res.status(500).json('error occured!')
        }
        else{
            //console.log(result)
            res.status(200).json(result)
            
           
        }
    })
}

export const editcompany = (req,res) =>{
    console.log(req.params)
    const values = [req.body.company_name,req.body.company_email,req.body.company_address,req.body.company_contact_no,req.body.company_status,req.params.id]
    const q = 'update companymanagement set company_name=?,company_email=?,company_address=?,company_contact_no=?,company_status=? where id=?'
    db.query(q,values,(error,result)=>{
        if(error){
            console.log(error)
            if(error.errno===1062){
                res.status(500).json('company name already exists!')
            }
            else{
            res.status(500).json('error occured!')
            }
        }
        else{
            
            console.log(result)
            res.status(200).json('company details updated successfully')
        }
    })
   
}

export const deletecompany=(req,res)=>{
    console.log(req.body)
    const q='delete from companymanagement where id in (?)'
    db.query(q,[req.body.id],(err,result)=>{
        
        if(err) {
            console.log(err)
            res.status(500).json(err)
        }
        else{
            console.log(result)
            res.status(200).json('Company Deleted Successfully')
        }
    })
    //res.status(500).json('from delete')
}