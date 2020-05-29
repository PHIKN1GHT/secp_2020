import { RouterPro } from "react-router-pro";
import React from 'react';
import Login from "./pages/Login";
import Register from './pages/Register';
export default function RouterP() {
    let data = [{
        name: "登录",
        path: "/Login",
        component: Login,
    }, {
        name: "注册",
        path: "/Register",
        component: Register,
    }];
    return (
        <RouterPro data={data} />
    )
}



