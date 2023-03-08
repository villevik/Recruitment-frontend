import { useEffect, useState } from "react";
import { getApplications, getRole, signOut } from "../api/APIService";
import { useLocation, useNavigate } from "react-router-dom";
import { NavWrapper } from "./NavWrapper";
import '../styles/Admin.css'

interface Application {
    fullname: string;
    status: string;
}

/**
 * The recruiter interface.
 * @returns table with applications
 */
export default function Admin() {
    const location = useLocation();

    const [role, setRole] = useState('');
    const [signOutTrigger, setSignOutTrigger] = useState(false);
    const [applications, setApplications] = useState<Application[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');

    //UseEffect to get applications from the backend.
    useEffect(() => {
        //Get the users and the jobs from the backend.
        try{
            const fetchRole = async () => {
                const data = await getRole();
                setRole(data.role);
                setRole(location.state?.role);  // This line is new. It sets the role to the role passed in the state.
                if(role === 'applicant'){
                    window.location.href = '/apply';
                }
                else if(role === 'none'){
                    window.location.href = '/';
                }
            };
            fetchRole();

            const fetchApplications = async () => {
                const data = await getApplications();
                const mappedData = data.Applications.map((application : string) => {
                    const [firstName, lastName, status] = application.split("+");
                    return {
                    fullname: `${firstName} ${lastName}`,
                    status,
                    };
                });
                setApplications(mappedData);
            }
            fetchApplications();
        }catch(err){
            setErrorMessage("Failed to get data from the server.");
        }
    }, [signOutTrigger])

    /**
     * handle sign out
     * 
     */
    const handleSignOut = async () => {
        try{
            await signOut();
            setSignOutTrigger(!signOutTrigger);
        }catch(err){
            console.log(err);
        }
    }

    /*
    *   This component is the admin page.
    *   It will be used to manage the users and the jobs.
    *   TODO: Add a table with all the applications.
    *   View all the applications for a job.
    * */
    return (
        <>
            <NavWrapper />
            <div className="top-right">
                <button onClick={handleSignOut}>Sign out</button>
                <span id="role">{role}</span>
                {location.state?.confirmationMessage && (
                    <p className="confirmationMessage">{location.state.confirmationMessage}</p>
                )}
            </div>
            <div className="admin-info">
                <h1>Admin</h1>
                <p>Here you can manage the users and the jobs.</p>
            </div>

            <div className="applications">
                <h2>Applications</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Full Name</th>
                            <th>STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((application, index) => (
                            <tr key={index}>
                                <td>{application.fullname}</td>
                                <td>{application.status}</td>
                                
                            </tr>
                        ))}
                    </tbody>
                </table>
                {errorMessage && <p id="errorMessage" className="shake">{errorMessage}</p>}
            </div>

        </>
    )
}