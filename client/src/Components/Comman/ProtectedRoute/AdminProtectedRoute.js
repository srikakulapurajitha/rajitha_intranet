import { Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import UserContext from '../../context/UserContext'
import { useContext } from 'react'

function AdminProtectedRoute(props) {
    const {component} = props
    const{userDetails} = useContext(UserContext)
    console.log('component',userDetails.access)
    if(Cookies.get('USERAUTHID') === undefined){
        return <Navigate to='/login' />
      }
    else if(userDetails.access==='admin'){
      return component
    }
    else{
      return <Navigate to='/' />
    }
}

export default AdminProtectedRoute