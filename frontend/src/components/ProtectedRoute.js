import React from 'react';
import { Navigate } from "react-router-dom";

// function ProtectedRoute({ component: Component, ...props }) {
//     return (
//         <>
//             {props.loggedIn ? <Component {...props} /> : <Navigate to="/sign-in" />}
//         </>
//     )
// }
function ProtectedRoute({ loggedIn, children }) {
    return (
        <>
            {loggedIn ? children : <Navigate to="/sign-in" />}
        </>
    )
}

export default ProtectedRoute;