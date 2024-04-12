import React, { useContext } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WithoutHeaderLayout from "../../styles/WithoutHeaderLayout";
import axios from 'axios';
import AuthContext from "../../context/AuthContext";
import logo from "../Login/Logo.png"


export default function Login() {

    const [passwordState, setPasswordState] = useState(false); //means that the initial state is set to false and it returns two elements - passwordState is the current state and setPasswordState is the new state

    const ifCheckboxChecked = () => {

        setPasswordState(!passwordState);

    };

    const navigate = useNavigate()

    let {userLogin} = useContext(AuthContext)
    

    return (

        <WithoutHeaderLayout>

        <div className="container d-flex justify-content-center align-items-center" style={{minHeight: '100vh'}}>
          <div className="p-3 text-center" style={{width: '100%', maxWidth: '500px', height: '500px', border: '2px solid', borderRadius: '15px', marginTop: '15px'}}>
        <img src={logo}/>
        <form action="login-form" onSubmit={userLogin}>
          <div className="input-group" style={{marginTop: '20px'}}>
            <input
              type="email"
              name="email"
              id="emailAddress"
              placeholder="Enter your email address"
              required="Valid email address required"
              className="form-control text-center" style={{border: '2px solid', borderRadius: '15px', backgroundColor: '#eeeeee' }}
            />
          </div>
          <div className="input-group" style={{marginTop: '20px'}}>
            <input
              type={passwordState ? 'text' : 'password'}
              name="password"
              id="password"
              placeholder="Enter your password"
              required=""
              className="form-control text-center" style={{border: '2px solid', borderRadius: '15px', backgroundColor: '#eeeeee'}}
            />
            </div>
            <div className="showPassword">
              <label>
                Show password
                <input
                type="checkbox"
                checked={passwordState}
                onChange={ifCheckboxChecked}
              />
              </label> 
            </div>
            
          <div className="d-grid col-5 mx-auto">

          <button type="submit" id="loggedIn" className="btn btn-primary mt-5" style={{borderRadius: '20px'}}>
            Login
          </button>
          <button className="btn btn-primary mt-3" style={{borderRadius: '20px'}} onClick={() => navigate('/Register')}>
            Register
          </button>

          </div> 
          
        </form>
        </div>
      </div>

      </WithoutHeaderLayout>
    



    )












}