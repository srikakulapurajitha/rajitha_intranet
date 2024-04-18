import { Navigate, useLocation } from 'react-router-dom'
import Cookies from 'js-cookie'
import { UserAccessContext } from '../../context/UserAccessContext';
import { useContext } from 'react';


function CommanProtectedRoute(props) {
    const { component } = props
    const location = useLocation();
    const { pagesToBeNotAccessed } = useContext(UserAccessContext)

    let pages = []

    if (pagesToBeNotAccessed !== null) {
        pages = pagesToBeNotAccessed.map(page => page.toLowerCase()).filter(page => page !== '')
    }


    const path = location.pathname.replace('/', '').toLowerCase()
    //console.log(path, pages)

    if (Cookies.get('USERAUTHID') === undefined) {
        return <Navigate to='/login' />
    }
    else if (pagesToBeNotAccessed === null) {
        return <Navigate to={location.pathname} replace />
    }
    else if (pages.includes(path)) {
        return <Navigate to='/' />
    }
    else {
        return component
    }
}

export default CommanProtectedRoute