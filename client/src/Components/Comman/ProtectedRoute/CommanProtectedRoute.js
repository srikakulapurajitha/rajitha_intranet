import { Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'


function CommanProtectedRoute(props) {
    const {component} = props
    if(Cookies.get('USERAUTHID') === undefined){
        return <Navigate to='/login' />
      }
   
    else{
        return component
    }
}

export default CommanProtectedRoute