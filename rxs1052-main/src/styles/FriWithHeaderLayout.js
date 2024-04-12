import React from "react";
import Header from "../components/Header/FriHeader";

export default function FriWithHeaderLayout({ children }) {
    return (
        <>

            <Header />
            <div className="friend-content"> 


                {children} 



            </div>
        
        </>
    );
};
