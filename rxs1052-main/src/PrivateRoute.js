import { redirect, Route } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "./context/AuthContext";

const PrivateRoute = ({children, ...rest}) => {

    let {user} = useContext(AuthContext)
    return(
        <Route {...rest}>{!user ? <redirect to='/Login'/> : children}</Route>
    )


}

export default PrivateRoute;