import axios from 'axios';

/**
 * Create an axios instance
 */
const api = axios.create({
    baseURL: 'https://recruitmentg10.azurewebsites.net/api/', //'http://localhost:8080/api/',
    withCredentials: true,
    headers: { "Content-Type": "application/json"
}
    
});

/**
 * signIn - send username and password to backend
 * @param username
 * @param password
 * @returns userdata
 */
export const signIn = async (username: string, password: string): Promise<any> => {
    console.log("signIn");
    const { data } = await api.post('auth/signin', {
        username: username,
        password: password
    })
    console.log(data);
    return data;
}

/**
 * signUp - send user data to backend
 * @param firstname
 * @param lastname
 * @param email
 * @param personnumber
 * @param username
 * @param password
 * @returns confirmation
 */
export const signUp = async (firstname : string, lastname : string,  email: string, personnumber : string, username: string,password: string): Promise<any> => {
    console.log("signUp");
    const { data } = await api.post('auth/signup', {
        name: firstname,
        surname: lastname,
        email: email,
        pnr: personnumber,
        username: username,
        password: password,
        role: "applicant"
    })
    return data;
}

export const setAuthorizationHeader = (token: string) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

/**
 * getCompetences - get all competences from backend
 * @returns competences
 */
export const getCompetences = async (): Promise<any> => {
    console.log("getCompetences");
    const { data } = await api.post('competence/list');
    return data;
}

/**
 * saveApplication - send application data to backend
 * updates application if application already exists
 * @param competences
 * @param experiences
 * @param fromDate
 * @param toDate
 * @returns confirmation
 */
export const saveApplication = async (competences: string[], experiences: number[], fromDate : string, toDate : string): Promise<any> => {
    console.log("saveApplication");
    console.log(competences, experiences, fromDate, toDate);
    const { data } = await api.post('applications/save', {
        competences: competences,
        experiences: experiences,
        fromDate: fromDate,
        toDate: toDate
    })
    return data;
}

/**
 * getRole
 * @returns role
 */
export const getRole = async (): Promise<any> => {
    console.log("getRole");
    const { data } = await api.post('auth/getRole');
    return data;
}

/**
 * getApplications
 * @returns applications {name, surname, status}
 */
export const getApplications = async (): Promise<any> => {
    console.log("getApplications");
    const { data } = await api.post('applications/listApplications');
    return data;
}

/**
 * signOut
 * @returns confirmation
 **/
export const signOut = async (): Promise<any> => {
    console.log("signOut");
    const { data } = await api.post('auth/signout');
    return data;
}
