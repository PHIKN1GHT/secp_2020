import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import Toast from '../components/Toast';

export default function LoginPage(props) {
    if (localStorage.getItem('access_token')) {
        // TODO
        // 检测token时效后，有效则跳转
    }
    const host = 'http://188.131.174.176:8082'
    const captchaURL = host + '/api/account/captcha?' + Date.now()
    const [captchacaptchaTimes, setCaptchaTimes] = useState(0)
    const handleChangeCaptcha = () => {
        setCaptchaTimes(prevState => prevState + 1)
    }
    const handleLogin = (event) => {
        const username = document.getElementsByName('username')[0].value
        const password = document.getElementsByName('password')[0].value
        const captcha = document.getElementsByName('captcha')[0].value
        const bodyData = JSON.stringify({
            username: username,
            password: password,
            captcha: captcha
        })
        const url = host + '/api/account/login'
        fetch(url, {
            body: bodyData, // must match 'Content-Type' header
            credentials: 'include', // include, same-origin, *omit
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // *client, no-referrer
        }).then(response => response.json()
        ).then(json => {
            if (json['result']) {
                // 成功登录
                Toast('登陆成功', 500)
                localStorage.setItem('access_token', json['access_token'])
                // 检验账号类型
                // TODO
                switch (json['type']) {
                    case '':
                        break;
                    default:
                        props.history.push({ pathname: '/mainpage' })
                        break;
                }
            }
            else {
                //失败
                Toast('登陆失败，请检查用户名和密码是否正确', 500)
                handleChangeCaptcha()
            }
        })
    }
    return (
        <div className='login'>
            <div className='login-card'>
                <div className='card-content'>
                    <div className='header'>Login</div>
                    <form className='login-wrapper'>
                        <div className='username-input'>
                            <TextField fullWidth variant='outlined'
                                name='username' label='USERNAME' defaultValue='SYSTEM'>
                            </TextField>
                        </div>
                        <div className='password-input'>
                            <TextField fullWidth
                                variant='outlined' name='password' label='PASSWORD' type='password' defaultValue='This is a simple SALT'>
                            </TextField>
                        </div>
                        <div className='captcha'>
                            <img className='captcha-img'
                                onClick={handleChangeCaptcha}
                                crossOrigin='use-credentials'
                                src={captchaURL}
                                name='captcha-img'
                                key={`captcha-${captchacaptchaTimes}`} />
                            <div className='captcha-input'>
                                <TextField fullWidth variant='outlined' name='captcha' label='CAPTCHA'></TextField>
                            </div>
                        </div>
                        <div className='login-btn'>
                            <Button fullWidth className='login-btn-' onClick={handleLogin}>
                                Login
                            </Button>
                        </div>
                    </form>
                </div>
                <div className='card-action'>
                    Don't Have Account? <a href='/register' className='reg'>Register</a>
                </div>
                <a href='/userInfo'></a>
            </div>
        </div>)
}