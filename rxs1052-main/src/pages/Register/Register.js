import React, { useState } from "react";
import WithoutHeaderLayout from "../../styles/WithoutHeaderLayout";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import logo from "../Register/Logo.png"
import Swal from "sweetalert2";

//axios.defaults.xsrfCookieName = "csrftoken";
//axios.defaults.xsrfHeaderName = "X-CSRFToken";
//axios.defaults.withCredentials = true;

const client = axios.create({
    baseURL: 'http://127.0.0.1:8000'
});


export default function Register() {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const headers = {
        'Content-Type': 'application/json'
    }

    let userRegister = async(e)  => {
        e.preventDefault();
        const body = JSON.stringify({
            email: e.target.email.value,
            password: e.target.password.value,
            username: e.target.name.value
        })

        try {

        const res = await client.post("/userapi/api/register/",body, {headers : headers}) 
        if (res.status === 201) {
            navigate('/');
            Swal.fire({
                icon: 'success',
                title: 'Successfully registered',
              })
        } 

        }catch(error) {
            Swal.fire({
                icon: 'error',
                title: 'Please make sure all fields are filled. Email address may already exist',
              })
        };

}
    
    return (
        <WithoutHeaderLayout>

        <div className="container d-flex justify-content-center align-items-center" style={{minHeight: '100vh'}}>
            <div className="p-3 text-center" style={{width: '100%', maxWidth: '500px', height: '500px', border: '2px solid', borderRadius: '15px', marginTop: '15px'}}>
            <img src={logo}/>

            <form id="register-form" onSubmit={userRegister}>

            <div className="input-group" style={{marginTop: '20px'}}>
                <input
                type="email"
                name="email"
                id="email"
                placeholder="Email address"
                className="form-control text-center" style={{border: '2px solid', borderRadius: '15px', backgroundColor: '#eeeeee' }}
                required=""
                />
            </div>
            
            <div className="input-group" style={{marginTop: '20px'}}>
                <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                className="form-control text-center" style={{border: '2px solid', borderRadius: '15px', backgroundColor: '#eeeeee' }}
                required=""
                />
            </div>
            
            <div className="input-group" style={{marginTop: '20px'}}>
                <input
                type="text"
                name="name"
                id="username"
                placeholder="Name"
                className="form-control text-center" style={{border: '2px solid', borderRadius: '15px', backgroundColor: '#eeeeee' }}
                required=""
                />
            </div>
            
            <div className="d-grid col-5 mx-auto">
                <button type="submit" className="btn btn-primary mt-5" style={{borderRadius: '20px'}}>Register</button>
            </div>
  </form>
  </div>
</div>

        </WithoutHeaderLayout>





    )




};