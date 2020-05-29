import { RouterPro } from "react-router-pro";
import React from 'react';
import LoginPage from "./pages/Login";
import RegisterPage from './pages/Register';
import UserInfoPage from "./pages/UserInfo";

export default function RouterP(props) {
    let data = [{
        name: "登录",
        path: "/Login",
        component: LoginPage,
    }, {
        name: "注册",
        path: "/Register",
        component: RegisterPage,
    }, {
        name: '用户信息',
        path: '/UserInfo',
        component: UserInfoPage,
    }];
    return (
        <RouterPro data={data} />
    )
}



