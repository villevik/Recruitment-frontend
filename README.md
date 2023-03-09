# Recruitment-frontend

The app is built using Vite JS with React + Typescript JSX
Node v18.13.0 npm v8.19.3

## To run the site:
  'cd recruitment'  
  'npm i'  
  'npm run dev'  
  /or 'npm run build' and then 'npm run preview' to run production build
  
The application consists of a register and login page which lets you register a new user or log in with an existing user in the database. 
Once logged in, depending on whether you are an applicant or a recruiter you will be directed to the corresponding page. 

The backend of the application verifies all the actions that the user is trying to do so that you can't make changes that the user is uneligble to do. 


## API Calls
The backend have to have the url of the frontend allowed in the corsconfiguration in WebSecurityConfig.java. 

All the calls that can be made are found in APIService.tsx in the api folder. It uses the Axios node module to make the calls.
