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
                <img src='https://res.cloudinary.com/dozj3jkhe/image/upload/v1701430358/intranet/loader_zvroqn.gif' alt='loader' style={{ mixBlendMode: 'lighten' }} />
            </Backdrop>
        </>
    )
}

export default Loader