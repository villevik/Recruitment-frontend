import { signIn, setAuthorizationHeader } from '../api/APIService'
import { useNavigate, useLocation } from 'react-router-dom';
import { FormEvent, useState } from "react";
import { NavWrapper } from './NavWrapper';

/**
 * Login page
 * @returns login form
 */
export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    const [errorMessage, setErrorMessage] = useState("");

    const checkLogin = (event : FormEvent) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        if(form.checkValidity()){
            const username = (document.getElementById('username') as HTMLInputElement).value;
            const password = (document.getElementById('password') as HTMLInputElement).value;
            const loginButton = document.getElementById('loginButton') as HTMLButtonElement;
            // Send data to backend
            console.log(username, password);
            signIn(username, password).then((res) => {
                console.log(res);
                console.log(res.roles[0])
                console.log(res.accessToken)
                localStorage.setItem('accessToken', res.accessToken);
                setAuthorizationHeader(res.accessToken);

                if(res.roles[0] === "recruiter"){
                    navigate('/admin', { state: { confirmationMessage: "Login was successful!", role: res.roles[0] } });
                } else {
                    navigate('/apply', { state: { confirmationMessage: "Login was successful!", role: res.roles[0] } });
                }

            }).catch((err) => {
                console.log(err.message);
                
                setErrorMessage("Could not connect to server");
                console.log(errorMessage);
                // call the shake function in index.css
                loginButton.classList.add('shake');
                // remove the "shake" class after the animation is complete
                setTimeout(() => {
                    loginButton.classList.remove('shake');
                }, 1000);

                if( err.response.status === 401 ){  // default browser action would alert to sign in in a popup
                    setErrorMessage("Wrong username or password");
                    //loginButton.insertAdjacentHTML('afterend', '<p id="errorMessage" class="shake">Wrong username or password</p>');
                }
                else{
                    setErrorMessage("Something went wrong");
                }
                
            });
        }
    }

    return (
        <>
            <NavWrapper />
            <div className="top-right">
                {location.state?.confirmationMessage && (
                    <p className="confirmationMessage">{location.state.confirmationMessage}</p>
                )}
            </div>
            <div className="loginForm">
                <form onSubmit={(event) => checkLogin(event)}>
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" name="username" required/>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" required/>
                    <button type="submit" id="loginButton" /*onClick={checkLogin}*/>Login</button>
                </form>
                {errorMessage && <p id="errorMessage" className="shake">{errorMessage}</p>}
            </div>
            <p>
                Don't have an account? <a href="/register">Register</a>
            </p>
        </>
    )
}