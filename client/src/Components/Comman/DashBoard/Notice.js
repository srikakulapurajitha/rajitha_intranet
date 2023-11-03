import { Box, Card } from "@mui/material"
import Marquee from "react-fast-marquee"
import UserContext from "../../context/UserContext"
import { useContext, useEffect, useState } from "react"
import axios from "axios"
function Notice() {
    const {userDetails} = useContext(UserContext)
    const [notice, setNotice] = useState([])
    useEffect(()=>{
        axios.post('/api/notice',{company_name:userDetails.company_name,date:new Date().toLocaleDateString('en-CA').slice(0,10)})
        .then(res=>setNotice(res.data))
    },[userDetails])
    return (
        <>
        {notice.length !==0?
        <>
        <Box sx={{ color: 'red' }}>Notice*</Box>
        <Card>
            <Marquee>
                {notice?.map((item,index)=><span style={{ margin: 10,fontFamily:'arial' }}><span style={{color:'#FF3636',fontWeight:'bold'}}>{index+1}.{item.title}</span>: {item.description}</span>)}
            </Marquee>
        </Card>
        </>
        :<></>
        }
        </>
    )
}
export default Notice