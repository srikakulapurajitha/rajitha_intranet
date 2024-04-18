import CryptoJS from 'crypto-js';
import{ createContext, useContext, useEffect, useState } from 'react';
import UserContext from './UserContext';
import axios from 'axios';


const UserAccessContext = createContext()

function UserAccessProvider(props) {
    const {userDetails} = useContext(UserContext)
    //console.log('userDtails',userDetails)
    const [pagesToBeNotAccessed, setPagesToBeNotAccessed] = useState(null)
    const [update, setUpdate] = useState(0)
  
    useEffect(() => {
        const fetchUserAccess = () =>{
            axios.post('/api/getaccessdata', { emp_id:userDetails.employee_id })
                .then(res => {
                    //console.log('data',res.data,userDetails.employee_id )
                    const decrypted = JSON.parse(CryptoJS.AES.decrypt(res.data,process.env.REACT_APP_DATA_ENCRYPTION_SECRETE).toString(CryptoJS.enc.Utf8))
                    if(decrypted.length===0){
                        setPagesToBeNotAccessed([])
                    }
                    else{
                        
                        const data = decrypted[0]['restricted_pages'].split(',')
                        setPagesToBeNotAccessed(data)
                    }
                    
                })
                .catch()

        }

        if(userDetails.employee_id!== undefined){
            fetchUserAccess()
        }
  
     
       
  
    }, [userDetails.employee_id,update])
    //console.log('context called')

    const updateAccess = ()=>{
        setUpdate(prev=>prev+1)
    }
  
    
    return (
      <UserAccessContext.Provider value={{pagesToBeNotAccessed,updateAccess}}>
  
        {props.children}
        
      </UserAccessContext.Provider>
  
    )
  }
  
  export { UserAccessContext, UserAccessProvider };

