import axios from "axios";
import { createContext, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const client = axios.create({
    baseURL: 'http://127.0.0.1:8000'
});

const AuthContext = createContext();

export default AuthContext;

export const UserProvider = ({children}) => {

    const navigate = useNavigate();

    const headers = {
        'Content-Type': 'application/json'
    }


    const [authenticateTokens, setAuthenticateTokens] = useState (() => 
    sessionStorage.getItem('authenticateTokens') ? 
    JSON.parse(sessionStorage.getItem('authenticateTokens')) : null);

    const [user, setUser] = useState (() => 
    sessionStorage.getItem('authenticateTokens') ? 
    jwtDecode(sessionStorage.getItem('authenticateTokens')) : null);

    let userLogin = async(e)  => {
        e.preventDefault();
        const body = JSON.stringify({
            email: e.target.email.value,
            password: e.target.password.value
        })

        try {

        const res = await client.post("/userapi/api/token/",body, {headers : headers}) 
        if (res.status === 200) {
            console.log('Signed in')
            setAuthenticateTokens(res.data)
            setUser(jwtDecode(res.data.access))
            sessionStorage.setItem('authenticateTokens', JSON.stringify(res.data))
            navigate('/Feed')
        } 

        }catch(error) {
            Swal.fire({
                icon: 'error',
                title: 'Email address or password is incorrect. Please try again',
              })
        };
}

let userLogout = () => {

    setAuthenticateTokens(null);
    setUser(null);
    sessionStorage.removeItem('authenticateTokens');
    navigate('/')


}

let newRefreshToken = async () => {

    const body = JSON.stringify({
        refresh: authenticateTokens.refresh
    })
    const res = await client.post("/userapi/api/token/refresh/",body, {headers : headers}) 
    
    if (res.status === 200) {
        console.log('Updated token')
        setAuthenticateTokens(res.data)
        setUser(jwtDecode(res.data.access))
        sessionStorage.setItem('authenticateTokens', JSON.stringify(res.data))
    } else {
        userLogout()
    } 


}



let contextData = {

    authenticateTokens:authenticateTokens,
    user:user,
    userLogin:userLogin,
    userLogout:userLogout



}

useEffect (() => {

    let intervalID = setInterval(() => {

        if(authenticateTokens) {
            newRefreshToken()
        }

    }, 290000)

    return ()=> clearInterval(intervalID)

}, [authenticateTokens])



return(

    <AuthContext.Provider value={contextData}>

        {children}


    </AuthContext.Provider>



)




}