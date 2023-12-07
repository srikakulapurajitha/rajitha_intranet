import db from "../config/connectiondb.js";


export const serachUser = (req,res) =>{
    console.log(req.body)
    const {searchType, data} = req.body
    let search_query,search_values;
    switch (searchType){
        case 'view-all':
            search_query=`select employee_id, concat(first_name, ' ', last_name) as fullname, email, company_name from usermanagement where status='active'`
            break
        case 'alphabet-search':
            search_query=`select employee_id, concat(first_name, ' ', last_name) as fullname, email, company_name from usermanagement where first_name like ?`
            search_values=[data+'%']
            break
        case 'search-fileds':
            const fields = Object.keys(data)
            const filter = fields.filter(f=>data[f]!='')
            const query_structure= filter.map(d=>`${d}=?`).join(' and ')


            search_query = `select employee_id, concat(first_name, ' ', last_name) as fullname, email, company_name from usermanagement where `+query_structure
            
            search_values = filter.map(fields=>data[fields])
            console.log(search_query,search_values)
            break

        
            

    }
    if(search_query){
        db.query(search_query,search_values,(err,result)=>{
            if(err) {
                console.log(err)
                return res.status(500).json('error occured!')
            }
            else{
                console.log('res',result)
                return res.status(200).json(result)
            }
        })

    }
    

}

export const getuserdetails = (req,res) =>{
    const {emp_id} = req.body
    const q = `select profile_pic, concat(first_name, ' ', last_name) as fullname, designation, employee_id, blood_group, email, company_name, gender, date_of_birth, country, about_yourself from usermanagement where employee_id=?`
    const v =[emp_id]
    db.query(q, v, (err,result)=>{
        if(err) {
            console.log(err)
            return res.status(500).json('error occured!')
        }
        else{
            console.log('res',result)
            return res.status(200).json(result)
        }
    }
    )
    

}