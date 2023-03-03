import { useNavigate } from "react-router-dom";
import { signUp } from "../api/APIService";
import { FormEvent } from "react";
import { NavWrapper } from "./NavWrapper";
/**
 * Component for registering a new user
 */
export default function Register() {
    const navigate = useNavigate(); 
    // Send data to backend and redirect to login page
    const register = (event : FormEvent) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        if(form.checkValidity()){
            // Get data from form
            const firstname = document.getElementById('firstname') as HTMLInputElement;
            const lastname = document.getElementById('lastname') as HTMLInputElement;
            const email = document.getElementById('email') as HTMLInputElement;
            const person_number = document.getElementById('person_number') as HTMLInputElement;
            const username = document.getElementById('username') as HTMLInputElement;
            const password = document.getElementById('password') as HTMLInputElement;
            const loginButton = document.getElementById('regButton') as HTMLButtonElement;
            // Send data to backend
            signUp(firstname.value, lastname.value, email.value, person_number.value, username.value, password.value).then((data) => {
                console.log(data);
                // Redirect to login page
                navigate('/', { state: { confirmationMessage: "Registration was successful!" } });
                //window.location.href = '/';
            }).catch((error) => {
                console.log(error);
                // display error message and let user try again
                loginButton.insertAdjacentHTML('afterend', '<p id="errorMessage">Failed to register</p>');
                //alert("Something went wrong");
            })
        }
        
    }

    return (
        <>
            <NavWrapper />
            <div className="regForm">
                <p className="error-message" style={{ display: "none" }}></p>
                <form onSubmit={(event) => register(event)}>
                    <label htmlFor="firstname">Firstname</label>
                    <input type="text" id="firstname" name="firstname" required/>
                    <label htmlFor="lastname">Lastname</label>
                    <input type="text" id="lastname" name="lastname" required/>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" required/>
                    <label htmlFor="person_number">Person number</label>
                    <input type="text" id="person_number" name="person_number" required/>

                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" name="username" required/>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" required/>
                    <button type="submit" id="regButton" >Register</button>
                </form>
            </div>
            <p>
                Already have an account? <a href="/">Login</a>
            </p>
        </>
    )
}