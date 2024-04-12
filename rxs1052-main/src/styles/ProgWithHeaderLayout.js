import React from "react";
import Header from "../components/Header/ProgHeader";

export default function({ children }) {
    return (
        <>

            <Header />
            <div className="weight-content"> 


                {children} 



            </div>
        
        </>
    );
};
