import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Chest from './components/Exercise/Chest/Chest';
import Home from './App';


const loading = <div>loading ...</div>;


//const Account = Loadable({
//  loader: () => import(/* webpackChunkName: "account" */ 'app/modules/account'),
//  loading: () => loading,
//});

//const Admin = Loadable({
//  loader: () => import(/* webpackChunkName: "administration" */ 'app/modules/administration'),
//  loading: () => loading,
//});



const AppRoutes = () => {
  return (
    <div className="view-routes">

    <Routes>
        <Route index element={<Home />} />
        <Route path="/Chest" element={<Chest />} />
    </Routes>    
        

    </div>
  );
};

export default AppRoutes;