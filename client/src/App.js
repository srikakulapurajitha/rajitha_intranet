import React, { useContext } from 'react'
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom'
import Login from './Components/Comman/Login/Login'
import Dashboard from './Components/Comman/DashBoard/DashBoard'

import AddCompany from './Components/Admin/CompanyManagment/AddCompany'
import ViewCompany from './Components/Admin/CompanyManagment/ViewCompany'
import AddCompanyPages from './Components/Admin/CompanyPagesManagement/AddCompanyPages'
import ViewCompanyPages from './Components/Admin/CompanyPagesManagement/ViewCompanyPages'
import AddUser from './Components/Admin/UserManagement/AddUser'
import ViewUser from './Components/Admin/UserManagement/ViewUser'

import AdminProtectedRoute from './Components/Comman/ProtectedRoute/AdminProtectedRoute'
import UserProtectedRoute from './Components/Comman/ProtectedRoute/UserProtectedRoute'
import CommanProtectedRoute from './Components/Comman/ProtectedRoute/CommanProtectedRoute'

import { UserProvider } from './Components/context/UserProvider'
import Cookies from 'js-cookie'
import ForgotPassword from './Components/Comman/ForgotPassword/ForgotPassword'






export default function App() {
  //console.log(useContext(UserContext))



  return (
    <>
      <BrowserRouter>
        <UserProvider>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/forgotpassword' Component={ForgotPassword} />
            {Cookies.get('USERAUTHID') === undefined ? <Route path='*' element={<Navigate to='/login' replace />} /> : <Route path='*' element={<Navigate replace to='/' />} />}
            <Route path='/' element={<CommanProtectedRoute component={<Dashboard />} />} />

            {/*----------------------------ADMIN------------------------------------------------------------------------------------ */}
            <Route path='/addcompany' element={<AdminProtectedRoute component={<AddCompany />} />} />
            <Route path='/viewcompany' element={<AdminProtectedRoute component={<ViewCompany />} />} />
            <Route path='/addcompanypages' element={<AdminProtectedRoute component={<AddCompanyPages />} />} />
            <Route path='/viewcompanypages' element={<AdminProtectedRoute component={<ViewCompanyPages />} />} />
            <Route path='/adduser' element={<AdminProtectedRoute component={<AddUser />} />} />
            <Route path='/viewusers' element={<AdminProtectedRoute component={<ViewUser />} />} />
            {/*----------------------------USER------------------------------------------------------------------------------------ */}

            <Route path='*' element={<Navigate replace to='/' />} />
          </Routes>
        </UserProvider>


      </BrowserRouter>
    </>
  )
}
