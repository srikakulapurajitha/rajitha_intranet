import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import UserContext from './UserContext';
import { ToastContainer, toast } from 'react-toastify';



function UserProvider(props) {
  const [userDetails, setUserDetails] = useState({})
  const [unAuth, setUnAuth] = useState(false)
  const navigate = useNavigate()
  //console.log(context)

  useEffect(() => {

    if (Cookies.get('USERAUTHID') !== undefined) {
      axios.get('/api/checkuser')
        .then(res => setUserDetails(res.data))
        .catch(err => {

          if (err.response.data === "Unauthorized") {
            //console.log('hey', err)
            Cookies.remove('USERAUTHID')
            toast.error('Unauthorized user!')
            setUnAuth(true)
          }
          //console.log(err)
        })
    }

  }, [])
  //console.log('context called')

  if (unAuth) {
    setUnAuth(false)
    console.log('coming')

    return navigate('/login', { replace: true })
  }


  const handleUserDetails = (data) => {
    setUserDetails(data)
  }

  return (
    <UserContext.Provider value={{ userDetails, handleUserDetails }}>

      {props.children}
      <ToastContainer />
    </UserContext.Provider>

  )
}

export { UserProvider };


