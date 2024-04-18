import { Box, Card } from "@mui/material"
import Marquee from "react-fast-marquee"

//import { toast } from "react-toastify"
function Notice(props) {
    
    const {notice} = props
    
    return (
        <>
        {notice.length !==0?
        <>
        <Box sx={{ color: 'red', }}>Announcement*</Box>
        
        <Card className="notice" sx={{width:'100%'}}>
            <Marquee style={{ display:'flex'}}>
                {notice?.map((item,index)=><Box  key={index}><span style={{ margin: 10,fontFamily:'arial' }}><span style={{color:'#FF3636',fontWeight:'bold'}}>{index+1}.{item.title}</span>: {item.description}</span></Box>)}
            </Marquee>
        </Card>
       
        
        </>
        :null
        }
        </>
    )
}
export default Notice