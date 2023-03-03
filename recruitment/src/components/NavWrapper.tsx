import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { getRole } from "../api/APIService";

export function NavWrapper() {
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
  }