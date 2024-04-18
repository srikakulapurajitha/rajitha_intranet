import AdminNavBar from "./AdminNavBar";
import UserNavBar from "./UserNavBar";
import AccountsAdminNavBar from "./AccountsAdminNavBar";


import React, { useContext } from 'react'
import UserContext from "../../context/UserContext";
import ItAdminNavBar from "./ItAdminNavBar";
import HrAdminNavBar from "./HrAdminNavBar";

function AccessNavBar(props) {
    const {userIntroTour} = props
    const { userDetails } = useContext(UserContext)
    const {user_type, department} = userDetails

    if(user_type==='admin'){
        if(department==='management'){
            return <AdminNavBar userIntroTour={userIntroTour} />
        }
        else if(department === 'accounts'){
            return <AccountsAdminNavBar userIntroTour={userIntroTour}/>
        }
        else if(department === 'it'){
            return <ItAdminNavBar userIntroTour={userIntroTour}/>
        }
        else if(department === 'hr'){
            return <HrAdminNavBar userIntroTour={userIntroTour}/>
        }
        else{
            return <UserNavBar userIntroTour={userIntroTour}/>
        }

    }
    else{
        return <UserNavBar userIntroTour={userIntroTour} />
    }

 
}

export default AccessNavBar