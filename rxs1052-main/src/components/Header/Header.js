import React , {useContext} from "react";
import { Link } from "react-router-dom";
import './header.css'
import Logo from "./Logo.png"
import UserIcon from "./UserIcon.png"
import AuthContext from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";



export default function Header(){

    let {userLogout} = useContext(AuthContext)

    if(sessionStorage.getItem('authenticateTokens')) {
        const tokenDecode = jwtDecode(sessionStorage.getItem('authenticateTokens'))
        var userName = tokenDecode.username

    }

    return (
        <nav class="navbar navbar-expand-lg fixed-top" style={{backgroundColor: 'white'}}>
            <div class="container-fluid">
                <img src={Logo} style={{width: '175px'}}/>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse justify-content-center" id="navbarText">
                <ul class="navbar-nav">
                    <li class="nav-item px-2">
                        <Link class="nav-link" aria-current="page" to="/Feed" style={{fontWeight: 'bold'}}>Home</Link>
                    </li>
                    <li class="nav-item">
                        <Link class="nav-link" to="/Friends" style={{fontWeight: 'bold'}}>Friends</Link>
                    </li>
                    <li class="nav-item dropdown ps-2">
                        <a class="nav-link dropdown-toggle active" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{fontWeight: 'bold'}}>
                            Exercises
                        </a>
                        <ul class="dropdown-menu">
                            <li><Link class="dropdown-item" to="/Chest">Chest</Link></li>
                            <li><Link class="dropdown-item" to="/Back">Back</Link></li>
                            <li><Link class="dropdown-item" to="/Arms">Arms</Link></li>
                            <li><Link class="dropdown-item" to="/Shoulder">Shoulders</Link></li>
                            <li><Link class="dropdown-item" to="/Legs">Legs</Link></li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown px-2">
                        <a class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{fontWeight: 'bold'}}>
                            Progress Tracking
                        </a>
                        <ul class="dropdown-menu">
                            <li><Link class="dropdown-item" to="/Progress">Workout</Link></li>
                            <li><Link class="dropdown-item" to="/Account">Weight</Link></li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{fontWeight: 'bold'}}>
                            {userName}
                        </a>
                        <ul class="dropdown-menu">
                            <li><Link class="dropdown-item" onClick={userLogout} to="/">Logout</Link></li>
                        </ul>
                    </li>
                </ul>
                </div>
            </div>
        </nav>
    );
}


