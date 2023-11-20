import { Backdrop } from '@mui/material'
import React from 'react'

function Loader(props) {
    const{loader} = props
    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loader}
            >
                <img src='loader.gif' alt='loader' style={{ mixBlendMode: 'lighten' }} />
            </Backdrop>
        </>
    )
}

export default Loader