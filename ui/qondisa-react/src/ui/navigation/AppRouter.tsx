import "../../css/App.css";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginPage from "../auth/LoginPage";
import MainLayout from "../MainLayout";
import RequireAuth from "../../services/auth/RequireAuth";
import React from "react";
import Logout from "../../services/auth/Logout";

function AppRouter() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    {/*<Route index element={<RequireAuth><MainLayout/></RequireAuth>}/>*/}

                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/logout" element={<Logout><LoginPage/></Logout>}/>
                    <Route path="/*" element={<RequireAuth><MainLayout/></RequireAuth>}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default AppRouter;
