import { useEffect, useState } from "react";
import { getCompetences, signIn } from "../api/APIService";
import { saveApplication } from "../api/APIService";
import { getRole } from "../api/APIService";
import { useLocation, useNavigate } from "react-router-dom";
import { signOut } from "../api/APIService";
import { NavWrapper } from "./NavWrapper";

interface Competence {
    name: string;
    years: number;
}
interface Availability {
    fromDate: string;
    toDate: string;
}

const ApplicationForm = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [role, setRole] = useState('');
    const [signOutTrigger, setSignOutTrigger] = useState(false);
    const [competencesData, setCompetencesData] = useState<Competence[]>([]);
    const [competences, setCompetences] = useState<string[]>([]);
    const [availability, setAvailability] = useState<Availability>({
        fromDate: "",
        toDate: "",
    });

    // useEffect for getting competences
    useEffect(() => {
        
        console.log("Fetching data for application form");
        try {
            /**
             * fetchRole - get role from backend 
             * The backend doesn't seem to remember the role, the location state is used instead
             */
            const fetchRole = async () => {
                const data = await getRole();
                console.log(data.role);
                setRole(data.role);
                if (data.role === 'recruiter') {
                    navigate('/admin', { state: { confirmationMessage: "You're logged in as recruiter" } });
                    //window.location.href = '/admin';
                }
                else if (data.role === 'none') {
                    console.log("no role");
                    navigate('/', { state: { confirmationMessage: "Log in before accessing the page" } });
                    //window.location.href = '/';
                }
            };
            //fetchRole();
            getRole().then((data) => {
                console.log(data.role);
                setRole(data.role);
                setRole(location.state.role);
                console.log("Location role: ",location.state.role);
                if (role === 'recruiter') {
                    navigate('/admin', { state: { confirmationMessage: "You're logged in as recruiter" } });
                    //window.location.href = '/admin';
                }
                else if (role === 'none') {
                    console.log("no role");
                    navigate('/', { state: { confirmationMessage: "Log in before accessing the page" } });
                    //window.location.href = '/';
                }
            });
            
            const fetchCompetences = async () => {
                const res = await getCompetences();
                setCompetences(res);
            };
            fetchCompetences();
        } catch (err) {
            console.log(err);
        }

    }, [signOutTrigger]);

    /**
     * handle sign out
     * 
     */
    const handleSignOut = async () => {
        try {
            await signOut();
            setSignOutTrigger(!signOutTrigger);
        } catch (err) {
            console.log(err);
        }
    }
    /**
     * Function that updates a specific competence in the competencesData state array by changing its name property. 
     * It does this by creating a new array of competences using the map method 
     * and updating the specific competence object using the spread syntax.
     * @param index index of the competence to be updated
     * @param name new name of the competence
     */
    const handleCompetenceChange = (index: number, name: string) => {
        setCompetencesData((prevData) =>
            prevData.map((competence, i) =>
                i === index ? { ...competence, name } : competence
            )
        );
    };

    const handleYearsChange = (index: number, years: number) => {
        setCompetencesData((prevData) =>
            prevData.map((competence, i) =>
                i === index ? { ...competence, years } : competence
            )
        );
    };

    /**
     * Function that adds a new competence object to the competencesData state array.
     */
    const handleAddCompetence = () => {
        setCompetencesData((prevData) => [...prevData, { name: "", years: 0 }]);

    };

    const handleRemoveCompetence = (index: number) => {
        setCompetencesData((prevData) =>
            prevData.filter((_, i) => i !== index)
        );
    };


    // the dates
    const handleFromDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAvailability((prevData) => ({ ...prevData, fromDate: event.target.value }));
    };

    const handleToDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAvailability((prevData) => ({ ...prevData, toDate: event.target.value }));
    };

    /**
     * 
     * @param event 
     */
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(competencesData, availability);

        saveApplication(
            competencesData.map((competence) => competence.name),
            competencesData.map((competence) => competence.years),
            availability.fromDate,
            availability.toDate
        ).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err);
        })
        // render a component with the data
        const confirmation = document.querySelector(".submittedText") as HTMLElement;
        confirmation.style.display = "block";
    };

    const handleReset = () => {
        setCompetencesData([]);
        setAvailability({ fromDate: "", toDate: "" });
    };

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
            <form onSubmit={handleSubmit}>
                <h2>Competences</h2>
                {competencesData.map((competence, index) => (
                    <div key={index}>
                        <label htmlFor={`competence-${index}`}>Select a competence:</label>
                        <select
                            id={`competence-${index}`}
                            value={competence.name}
                            onChange={(event) =>
                                handleCompetenceChange(index, event.target.value)
                            }
                            required
                        >
                            <option value="">--Select a competence--</option>
                            {competences.map((competence) => (
                                <option key={competence} value={competence}>
                                    {competence}
                                </option>
                            ))}
                        </select>

                        <label htmlFor={`years-${index}`}>Number of years:</label>
                        <input
                            type="number"
                            id={`years-${index}`}
                            value={competence.years}
                            onChange={(event) =>
                                handleYearsChange(index, parseFloat(event.target.value))
                            }
                            min={0.1}
                            step={0.1}
                            required
                        />

                        <button type="button" onClick={() => handleRemoveCompetence(index)}>
                            Remove
                        </button>
                    </div>
                ))}

                <button type="button" onClick={handleAddCompetence}>
                    Add competence
                </button>
                <h2>Availability</h2>
                <div>
                    <label htmlFor="from-date">From date:</label>
                    <input
                        type="date"
                        id="from-date"
                        value={availability.fromDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={handleFromDateChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="to-date">To date:</label>
                    <input
                        type="date"
                        id="to-date"
                        value={availability.toDate}
                        min={availability.fromDate}
                        onChange={handleToDateChange}
                        required
                    />
                </div>
                <div className="application-confirmation">
                    <h1>Application Confirmation</h1>
                    <div className="application-confirmation__competences">
                        <h2>Competences</h2>
                        <ul>
                            {competencesData.map((competence, index) => (
                                <li key={index}>
                                    <span>{competence.name} </span>
                                    <span>{competence.years} yrs</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="application-confirmation__availability">
                        <h2>Availability</h2>
                        <p>From: {availability.fromDate}</p>
                        <p>To: {availability.toDate}</p>
                    </div>
                </div>
                <button className="cancelButton" type="button" onClick={handleReset}>Cancel</button>

                <button className="submitButton" type="submit">Submit</button>
                <p className="submittedText" style={{ display: "none" }}>The application has been submitted! You can leave the page or submit again to update the application.</p>
            </form>
        </>
    );
};

export default ApplicationForm;