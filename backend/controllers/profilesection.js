import db from "../config/connectiondb.js";


export const updatepersonalinfo = async(req, res) => {
    console.log(req.body)
    const { profile_pic, first_name, last_name, email, designation, gender,  country, about_yourself,emp_id } = req.body
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
    const update_personalinfo_query = `update usermanagement set profile_pic=?,first_name=?, last_name=?, designation=?, gender=?,  country=?, about_yourself=? where email=? and employee_id=?`
    const update_personalinfo_values = [profile_img, first_name, last_name, designation, gender,  country, about_yourself,email, emp_id]
    try{
        await db.promise().query(update_personalinfo_query,update_personalinfo_values)
        return res.status(200).json('Personal Info Updated Successfully')
    }
    catch{
        return res.status(500).json('error occured!') 
    }
    
}

export const getcontactinformation = (req,res)=>{
    console.log(req.body)
    const q = `select * from contactinformation where emp_id=?`
    const v = [req.body.emp_id]
    db.query(q,v,(err,result)=>{
        if(err) return res.status(500).json('error occured!')
        else{
            console.log(result)
            return res.status(200).json(result)
        }
    })
}

export const addcontactinformation = async(req,res)=>{
    console.log(req.body)
    const {address,aol,gtalk,home_phone,home_phone_ext,mobile1,mobile2,mobile3,mobile4,mobile5,msn,office_phone,office_phone_ext,skype,yahoo,zip_code,emp_id} = req.body
    const del_q = `delete from contactinformation where emp_id=?`
    const del_v = [emp_id]
    const insert_q = `insert into contactinformation(address,zip_code,home_phone,home_phone_ext,office_phone,office_phone_ext,mobile1,mobile2,mobile3,mobile4,mobile5,msn,aol,skype,yahoo,gtalk,emp_id) values(?) `
    const insert_v = [address,zip_code,home_phone,home_phone_ext,office_phone,office_phone_ext,mobile1,mobile2,mobile3,mobile4,mobile5,msn,aol,skype,yahoo,gtalk,emp_id]
    try{
        await db.promise().query(del_q,del_v)
        await db.promise().query(insert_q,[insert_v])
        return res.status(200).json('Contact information added successfully!')
        
    }
    catch(err){
        console.log(err)
        return res.status(500).json('error occured!')
    }
    
       

}