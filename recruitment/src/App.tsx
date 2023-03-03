import React, { useEffect, useState } from 'react'
import { Routes, Route, Link, Outlet, BrowserRouter } from 'react-router-dom'
import './App.css'
// Components
import ApplicationForm from './components/ApplicationForm'
import Login from './components/Login'
import Admin from './components/Admin'
import Register from './components/Register'
import { getRole } from './api/APIService'
import { NavWrapper } from './components/NavWrapper'

interface RoleData {
  role: string;
}


/**
 * Renders the application. Takes care of the routing.
 * @returns 
 */
function App() {


  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" /*element={<NavWrapper/>}*/ >
          <Route path="/" element={<Login />} />
          <Route path="/apply" element={<ApplicationForm />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

/*function NavWrapper() {
  const [navRole, setNavRole] = useState<string>('none');

  useEffect(() => {
    // Fetch the user's role from the backend.
    console.log("Fetching role");
    const fetchRole = async () => {
      const data = await getRole();
      setNavRole(data.role);
    };
    fetchRole();
  }, []);

  return (
    <>
      <nav style={{display: "flex", gap: "1rem"}}>
        {navRole === 'applicant' && <Link to="/apply">Application form</Link>}
        <hr/>
        <Link to="/">Login</Link>
        <hr/>
        {navRole === 'recruiter' && <Link to="/admin">Admin</Link>}
      </nav>  
      <Outlet /> 
    </>
  )
}*/

export default App
